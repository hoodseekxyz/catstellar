// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title Catstellar Flight Recorder
/// @notice Deploy this on Robinhood Chain (4663) before the Pons launch.
///         After the launch, the owner binds the Pons token once. Binding checks
///         the official Pons v2 factory and can never be repeated.
///
///         Mechanic: eleven stills. A wallet files each still once. Filing pulls
///         a fixed token amount and burns it in the same transaction. This
///         contract does not keep a balance, pay yield, or take a fee.
///         Still 0 is open after bind. Each later still opens when the one
///         before it has `quorum` distinct filings. The last still also waits
///         until the Pons launch has graduated into its pool (phase PoolCreated).
///
///         Remix: compiler 0.8.26, optimizer off is fine. Deploy with
///         fileCost_ (wei, 18 decimals) and quorum_. Then approve this contract
///         from the holder wallet and call file(frameId). Renounce only after bind.
interface ICatstellarToken {
    function launchFactory() external view returns (address);
    function curve() external view returns (address);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

interface IPonsV2Factory {
    enum GraduationPhase {
        NotGraduated,
        Swept,
        PoolCreated,
        Rescued
    }

    struct LaunchedToken {
        address token;
        address curve;
        address deployer;
        address creatorFeeRecipient;
        address pairToken;
        uint256 graduationThreshold;
        uint24 poolFee;
        int24 tickSpacing;
        uint16 creatorTaxBps;
        bool buybackEnabled;
        GraduationPhase phase;
        uint256 sweptQuote;
        uint256 sweptTokens;
        uint256 sweptAt;
        bool exists;
    }

    function getLaunchedToken(address token) external view returns (LaunchedToken memory);
}

contract CatstellarFlightRecorder {
    uint8 public constant FRAME_COUNT = 11;
    uint8 public constant LAST_FRAME = 10;
    address public constant PONS_V2_FACTORY = 0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e;
    uint256 public constant CHAIN_ID = 4663;

    error WrongChain();
    error NotOwner();
    error AlreadyBound();
    error NotBound();
    error NotAPonsLaunch();
    error UnknownFrame();
    error FrameClosed();
    error AlreadyFiled();
    error ZeroCost();
    error ZeroQuorum();
    error TransferFailed();
    error ShortPull();

    /// @notice Wei of the Pons token burned per filing. Immutable.
    uint256 public immutable fileCost;
    /// @notice Distinct filings required on a still before the next one opens.
    uint32 public immutable quorum;

    address public owner;
    address public token;

    uint32[11] public filings;
    mapping(uint8 frameId => mapping(address filer => bool filed)) public hasFiled;

    event Bound(address indexed token, address indexed curve, address indexed deployer);
    event Filed(uint8 indexed frameId, address indexed filer, uint32 filings, uint256 burned);
    event FrameOpened(uint8 indexed frameId);
    event OwnershipRenounced(address indexed previousOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /// @param fileCost_ Tokens burned per filing, in wei (18 decimals). Try 1000 ether.
    /// @param quorum_ Distinct wallets required to open the next still. Try 5.
    constructor(uint256 fileCost_, uint32 quorum_) {
        if (block.chainid != CHAIN_ID) revert WrongChain();
        if (fileCost_ == 0) revert ZeroCost();
        if (quorum_ == 0) revert ZeroQuorum();
        owner = msg.sender;
        fileCost = fileCost_;
        quorum = quorum_;
    }

    /// @notice Bind the Pons v2 token. Once. The factory must recognise it.
    function bind(address token_) external onlyOwner {
        if (token != address(0)) revert AlreadyBound();
        if (token_ == address(0)) revert NotAPonsLaunch();
        if (ICatstellarToken(token_).launchFactory() != PONS_V2_FACTORY) revert NotAPonsLaunch();

        IPonsV2Factory.LaunchedToken memory launch = IPonsV2Factory(PONS_V2_FACTORY).getLaunchedToken(token_);
        if (!launch.exists || launch.token != token_) revert NotAPonsLaunch();
        if (ICatstellarToken(token_).curve() != launch.curve || launch.curve == address(0)) {
            revert NotAPonsLaunch();
        }

        token = token_;
        emit Bound(token_, launch.curve, launch.deployer);
    }

    /// @notice Drop the owner key. Call this after bind, never before.
    function renounceOwnership() external onlyOwner {
        emit OwnershipRenounced(owner);
        owner = address(0);
    }

    /// @notice File one still. Burns `fileCost` of the bound token from the caller.
    function file(uint8 frameId) external {
        if (token == address(0)) revert NotBound();
        if (frameId >= FRAME_COUNT) revert UnknownFrame();
        if (!isOpen(frameId)) revert FrameClosed();
        if (hasFiled[frameId][msg.sender]) revert AlreadyFiled();

        hasFiled[frameId][msg.sender] = true;
        uint32 count = ++filings[frameId];

        ICatstellarToken t = ICatstellarToken(token);
        uint256 beforeBal = t.balanceOf(address(this));
        if (!t.transferFrom(msg.sender, address(this), fileCost)) revert TransferFailed();
        uint256 got = t.balanceOf(address(this)) - beforeBal;
        if (got != fileCost) revert ShortPull();
        // Burn everything held, including any token sent here by mistake.
        t.burn(t.balanceOf(address(this)));

        emit Filed(frameId, msg.sender, count, fileCost);
        if (frameId < LAST_FRAME && count == quorum) emit FrameOpened(frameId + 1);
    }

    function isOpen(uint8 frameId) public view returns (bool) {
        if (token == address(0) || frameId >= FRAME_COUNT) return false;
        if (frameId == 0) return true;
        if (filings[frameId - 1] < quorum) return false;
        if (frameId == LAST_FRAME) return phase() == uint8(IPonsV2Factory.GraduationPhase.PoolCreated);
        return true;
    }

    /// @notice 0 curve, 1 swept, 2 pool created, 3 rescued. 255 if no token yet.
    function phase() public view returns (uint8) {
        if (token == address(0)) return 255;
        return uint8(IPonsV2Factory(PONS_V2_FACTORY).getLaunchedToken(token).phase);
    }

    function frameTitle(uint8 frameId) external pure returns (string memory) {
        if (frameId == 0) return "Face the water";
        if (frameId == 1) return "Watch the hull";
        if (frameId == 2) return "Hold formation";
        if (frameId == 3) return "Meet the wall";
        if (frameId == 4) return "Keep the box";
        if (frameId == 5) return "Point at the table";
        if (frameId == 6) return "Read the shelf";
        if (frameId == 7) return "Take the shaft";
        if (frameId == 8) return "Walk the weather";
        if (frameId == 9) return "Climb anyway";
        if (frameId == 10) return "Remember the truck";
        revert UnknownFrame();
    }
}
