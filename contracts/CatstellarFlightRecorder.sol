// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title Catstellar Flight Recorder
/// @notice Helper. Deploy this on Robinhood Chain (4663) before the long.xyz launch.
///         The token comes later. The owner binds it once. Binding checks the Doppler
///         Airlock that long.xyz uses: the pair asset must be SPCX, and the integrator
///         must be long.xyz. It cannot be repeated.
///
///         Socials are constants. They are not editable.
///
///         Mechanic: eleven stills. A wallet files each still once. Filing pulls a
///         fixed token amount and burns it in the same transaction. This contract
///         does not keep a balance, pay yield, or take a fee. Still 0 opens after
///         bind. Each later still opens when the one before it has `quorum` distinct
///         filings. long.xyz opens its pool at launch, so the last still does not
///         wait on a second graduation step.
///
///         Remix: compiler 0.8.26. Deploy with fileCost_ (wei, 18 decimals) and
///         quorum_. Try 1000 ether and 5. After the long.xyz launch, call bind with
///         the token address only. The holder approves this contract, then calls
///         file(frameId). Renounce only after bind.
interface ILongToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

interface IAirlock {
    struct AssetData {
        address numeraire;
        address timelock;
        address governance;
        address liquidityMigrator;
        address poolInitializer;
        address pool;
        address migrationPool;
        uint256 numTokensToSell;
        uint256 totalSupply;
        address integrator;
    }

    function getAssetData(address asset) external view returns (AssetData memory);
}

contract CatstellarFlightRecorder {
    uint8 public constant FRAME_COUNT = 11;
    uint8 public constant LAST_FRAME = 10;
    /// @notice long.xyz launcher. Checksummed for solc.
    address public constant LONG_LAUNCHER = 0x22e99278308B393ea1260859B181AD7E78f5eeED;
    /// @notice Doppler Airlock that long.xyz launches through.
    address public constant AIRLOCK = 0xeb7C034704eF8Dcd2D32324c1545f62fB4aD0862;
    /// @notice Robinhood Chain SPCX. The only pair this recorder accepts.
    address public constant SPCX = 0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa;
    /// @notice Integrator stamped on long.xyz launches.
    address public constant LONG_INTEGRATOR = 0x92d435C96E63c43E12d6D0AB28f6b0B04072F765;
    uint256 public constant CHAIN_ID = 4663;

    string public constant SITE = "https://catstellar.xyz";
    string public constant X_SOCIAL = "https://x.com/catstellarX";

    error WrongChain();
    error NotOwner();
    error AlreadyBound();
    error NotBound();
    error NotALongLaunch();
    error NotSpcxPair();
    error UnknownFrame();
    error FrameClosed();
    error AlreadyFiled();
    error ZeroCost();
    error ZeroQuorum();
    error TransferFailed();
    error ShortPull();

    /// @notice Wei of the token burned per filing. Immutable.
    uint256 public immutable fileCost;
    /// @notice Distinct filings required on a still before the next one opens.
    uint32 public immutable quorum;

    address public owner;
    address public token;

    uint32[11] public filings;
    mapping(uint8 frameId => mapping(address filer => bool filed)) public hasFiled;

    event Bound(address indexed token, address indexed pool, address indexed numeraire);
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

    /// @notice The two links. They do not change.
    function socials() external pure returns (string memory site, string memory x) {
        return (SITE, X_SOCIAL);
    }

    /// @notice Bind the long.xyz token. Once. It must be paired with SPCX.
    function bind(address token_) external onlyOwner {
        if (token != address(0)) revert AlreadyBound();
        if (token_ == address(0)) revert NotALongLaunch();

        IAirlock.AssetData memory asset = IAirlock(AIRLOCK).getAssetData(token_);
        if (asset.integrator != LONG_INTEGRATOR || asset.pool == address(0)) revert NotALongLaunch();
        if (asset.numeraire != SPCX) revert NotSpcxPair();

        token = token_;
        emit Bound(token_, asset.pool, asset.numeraire);
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

        ILongToken t = ILongToken(token);
        uint256 beforeBal = t.balanceOf(address(this));
        if (!t.transferFrom(msg.sender, address(this), fileCost)) revert TransferFailed();
        uint256 got = t.balanceOf(address(this)) - beforeBal;
        if (got != fileCost) revert ShortPull();
        // DopplerERC20V1.burn burns the caller's balance. This contract is the caller.
        t.burn(t.balanceOf(address(this)));

        emit Filed(frameId, msg.sender, count, fileCost);
        if (frameId < LAST_FRAME && count == quorum) emit FrameOpened(frameId + 1);
    }

    function isOpen(uint8 frameId) public view returns (bool) {
        if (token == address(0) || frameId >= FRAME_COUNT) return false;
        if (frameId == 0) return true;
        return filings[frameId - 1] >= quorum;
    }

    /// @notice Pool long.xyz opened for the bound token. Zero before bind.
    function pool() public view returns (address) {
        if (token == address(0)) return address(0);
        return IAirlock(AIRLOCK).getAssetData(token).pool;
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
