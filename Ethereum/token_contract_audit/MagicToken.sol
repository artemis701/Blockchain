// SPDX-License-Identifier: MIT
// File: contracts/ASTRO/interface/InterfaceLP.sol


pragma solidity ^ 0.8.0;

interface InterfaceLP {
    function sync() external;
}
// File: contracts/ASTRO/interface/IDEXRouter.sol


pragma solidity >=0.4.22 <0.9.0;

interface IJoeRouter01 {
    function factory() external pure returns (address);

    function WAVAX() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityAVAX(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountAVAXMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountAVAX,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityAVAX(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountAVAXMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountAVAX);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityAVAXWithPermit(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountAVAXMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountToken, uint256 amountAVAX);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactAVAXForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactAVAX(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForAVAX(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapAVAXForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) external pure returns (uint256 amountB);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}
interface IDEXRouter is IJoeRouter01 {
    function removeLiquidityAVAXSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountAVAXMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountAVAX);

    function removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountAVAXMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountAVAX);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactAVAXForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForAVAXSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

// File: contracts/ASTRO/interface/IDEXFactory.sol


pragma solidity ^ 0.8.0;

interface IDEXFactory {
    function createPair(address tokenA, address tokenB)
    external
    returns (address pair);
}
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: contracts/ASTRO/library/ERC20Detailed.sol


pragma solidity ^ 0.8.0;


abstract contract ERC20Detailed is IERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) {
        _name = _tokenName;
        _symbol = _tokenSymbol;
        _decimals = _tokenDecimals;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }
}
// File: contracts/ASTRO/library/SafeMathInt.sol


pragma solidity ^ 0.8.0;

library SafeMathInt {
    int256 private constant MIN_INT256 = int256(1) << 255;
    int256 private constant MAX_INT256 = ~(int256(1) << 255);

    function mul(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a * b;

        require(c != MIN_INT256 || (a & MIN_INT256) != (b & MIN_INT256));
        require((b == 0) || (c / b == a));
        return c;
    }

    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != -1 || a != MIN_INT256);

        return a / b;
    }

    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));
        return c;
    }

    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));
        return c;
    }

    function abs(int256 a) internal pure returns (int256) {
        require(a != MIN_INT256);
        return a < 0 ? -a : a;
    }
}
// File: @openzeppelin/contracts/utils/math/SafeMath.sol


// OpenZeppelin Contracts v4.4.1 (utils/math/SafeMath.sol)

pragma solidity ^0.8.0;

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

// File: contracts/ASTRO/MagicToken.sol


pragma solidity ^0.8.0;







contract MagicToken is ERC20Detailed {
    using SafeMath for uint256;
    using SafeMathInt for int256;

    address owner;

    bool public initialDistributionFinished = false;
    bool public swapEnabled = false;
    bool public autoRebase = false;
    bool public feesOnNormalTransfers = false;

    uint256 public rewardYield = 4000000; // APY: 100,103.36795485453209020930376137, Daily ROI: 1.910846122730853405394701828557
    uint256 public rewardYieldDenominator = 10000000000;
    uint256 public maxSellTransactionAmount = 50000 * 10**DECIMALS;

    uint256 public rebaseFrequency = 1800;
    uint256 public nextRebase = block.timestamp + 43200000;

    mapping (address => bool) _isFeeExempt;
    address[] public _markerPairs;
    mapping (address => bool) public automatedMarketMakerPairs;
    mapping (address => bool) public justBusinessList;
    mapping (address => uint256) private userInitialAmount;

    uint256 private constant MAX_REBASE_FREQUENCY = 1800;
    uint256 private constant DECIMALS = 18;
    uint256 private constant MAX_UINT256 = ~uint256(0);
    uint256 private constant INITIAL_FRAGMENTS_SUPPLY = 5 * 10**8 * 10**DECIMALS;
    uint256 private TOTAL_GONS;
    uint256 private constant MAX_SUPPLY = ~uint256(0);

    address DEAD = 0x000000000000000000000000000000000000dEaD;
    address ZERO = 0x0000000000000000000000000000000000000000;

    address public liquidityReceiver = DEAD; 
    address public treasuryReceiver = DEAD;
    address public magicVaultReceiver = DEAD;
    address public magicBankReceiver = DEAD;
    address public futureEcosystemReceiver = DEAD;
    address public burnReceiver = DEAD;

    IDEXRouter public router;
    address public pair;
    IERC20 public usdcAddress;

    /*
        0: Sell Fee
        1: Whale Sell Fee 
        2: Invader Fee
    */
    uint256[4] public totalFee          = [2000, 5000, 8000];
    uint256[4] public liquidityFee      = [500, 1250, 2000];
    uint256[4] public treasuryFee       = [500, 1250, 2000];
    uint256[4] public magicVaultFee     = [200, 500, 800];
    uint256[4] public magicBankFee      = [300, 750, 1200];
    uint256[4] public ecosystemFee      = [300, 750, 1200];
    uint256[4] public burnFee           = [200, 500, 800];
    uint256 public feeDenominator       = 10000;

    uint256 public normalSellLimit       = 1 * 10 ** 4 * 10 ** 6;
    uint256 public whaleSellLimit        = 25 * 10 ** 3 * 10 ** 6;

    uint256 targetLiquidity = 50;
    uint256 targetLiquidityDenominator = 100;

    bool inSwap;

    modifier swapping() {
        inSwap = true;
        _;
        inSwap = false;
    }

    modifier validRecipient(address to) {
        require(to != address(0x0));
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "MagicToken: Caller is not owner the contract.");
        _;
    }

    uint256 private _totalSupply;
    uint256 private _gonsPerFragment;
    uint256 private gonSwapThreshold = (TOTAL_GONS * 10).div(10000);

    mapping(address => uint256) private _gonBalances;
    mapping(address => mapping(address => uint256)) private _allowedFragments;

    constructor(address _router, address _usdcAddress) ERC20Detailed("Magic Ventures", "$MGV", uint8(DECIMALS)) {
        owner = msg.sender;
        TOTAL_GONS = MAX_UINT256 - (MAX_UINT256 % INITIAL_FRAGMENTS_SUPPLY);
        router = IDEXRouter(_router);
        usdcAddress = IERC20(_usdcAddress);
        pair = IDEXFactory(router.factory()).createPair(address(this), router.WAVAX());

        _allowedFragments[address(this)][address(router)] = ~uint256(0);
        _allowedFragments[address(this)][pair] = ~uint256(0);
        _allowedFragments[address(this)][address(this)] = ~uint256(0);

        setAutomatedMarketMakerPair(pair, true);

        _totalSupply = INITIAL_FRAGMENTS_SUPPLY;
        _gonBalances[msg.sender] = TOTAL_GONS;
        _gonsPerFragment = TOTAL_GONS.div(_totalSupply);

        _isFeeExempt[liquidityReceiver] = true;
        _isFeeExempt[treasuryReceiver] = true;
        _isFeeExempt[magicVaultReceiver] = true;
        _isFeeExempt[magicBankReceiver] = true;
        _isFeeExempt[futureEcosystemReceiver] = true;
        _isFeeExempt[burnReceiver] = true;
        _isFeeExempt[address(this)] = true;
        _isFeeExempt[msg.sender] = true;

        emit Transfer(address(0x0), msg.sender, _totalSupply);
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function allowance(address owner_, address spender) external view override returns (uint256) {
        return _allowedFragments[owner_][spender];
    }

    function balanceOf(address who) public view override returns (uint256) {
        if (automatedMarketMakerPairs[who])
            return _gonBalances[who];
        else
            return _gonBalances[who].div(_gonsPerFragment);
    }

    function initialBalanceOf(address who) public view returns (uint256) {
        return userInitialAmount[who];
    }

    function checkFeeExempt(address _addr) external view returns (bool) {
        return _isFeeExempt[_addr];
    }

    function checkSwapThreshold() external view returns (uint256) {
        return gonSwapThreshold.div(_gonsPerFragment);
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function shouldRebase() internal view returns (bool) {
        return nextRebase <= block.timestamp;
    }

    function shouldTakeFee(address from, address to) internal view returns (bool) {
        if (_isFeeExempt[from] || _isFeeExempt[to]) {
            return false;
        } else if (feesOnNormalTransfers) {
            return true;
        } else {
            return (automatedMarketMakerPairs[from] || automatedMarketMakerPairs[to]);
        }
    }

    function shouldSwapBack() internal view returns (bool) {
        return
            !automatedMarketMakerPairs[msg.sender] &&
            !inSwap &&
            swapEnabled &&
            totalFee[0] + totalFee[1] > 0 &&
            _gonBalances[address(this)] >= gonSwapThreshold;
    }

    function getCirculatingSupply() public view returns (uint256) {
        return (TOTAL_GONS.sub(_gonBalances[DEAD]).sub(_gonBalances[ZERO])).div(_gonsPerFragment);
    }

    function getLiquidityBacking(uint256 accuracy) public view returns (uint256) {
        uint256 liquidityBalance = 0;
        for (uint i = 0; i < _markerPairs.length; i++){
            liquidityBalance.add(balanceOf(_markerPairs[i]).div(10 ** 9));
        }
        return accuracy.mul(liquidityBalance.mul(2)).div(getCirculatingSupply().div(10 ** 9));
    }

    function isOverLiquified(uint256 target, uint256 accuracy) public view returns (bool) {
        return getLiquidityBacking(accuracy) > target;
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function manualSync() public {
        for (uint i = 0; i < _markerPairs.length; i++){
            InterfaceLP(_markerPairs[i]).sync();
        }
    }

    function transfer(address to, uint256 value) external override validRecipient(to) returns (bool) {
        _transferFrom(msg.sender, to, value);
        return true;
    }

    function _basicTransfer(address from, address to, uint256 amount) internal returns (bool) {
        uint256 gonAddAmount = amount.mul(_gonsPerFragment);
        uint256 gonSubAmount = amount.mul(_gonsPerFragment);

        if (automatedMarketMakerPairs[from])
            gonSubAmount = amount;

        if (automatedMarketMakerPairs[to])
            gonAddAmount = amount;

        _gonBalances[from] = _gonBalances[from].sub(gonSubAmount);
        _gonBalances[to] = _gonBalances[to].add(gonAddAmount);

        emit Transfer(from, to, amount);
        return true;
    }

    function _transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
        bool excludedAccount = _isFeeExempt[sender] || _isFeeExempt[recipient];

        require(initialDistributionFinished || excludedAccount, "Trading not started");

        if (
            automatedMarketMakerPairs[recipient] &&
            !excludedAccount
        ) {
            require(amount <= maxSellTransactionAmount, "Error amount");
        }

        if (inSwap) {
            return _basicTransfer(sender, recipient, amount);
        }

        uint256 gonAmount = amount.mul(_gonsPerFragment);

        if (shouldSwapBack()) {
            swapBack();
        }

        if (automatedMarketMakerPairs[sender]) {
            _gonBalances[sender] = _gonBalances[sender].sub(amount);
        }
        else {
            _gonBalances[sender] = _gonBalances[sender].sub(gonAmount);
        }

        uint256 gonAmountReceived = shouldTakeFee(sender, recipient) ? takeFee(sender, recipient, gonAmount) : gonAmount;
        if (automatedMarketMakerPairs[recipient]) {
            _gonBalances[recipient] = _gonBalances[recipient].add(gonAmountReceived.div(_gonsPerFragment));
        }
        else {
            _gonBalances[recipient] = _gonBalances[recipient].add(gonAmountReceived);
        }

        emit Transfer(sender, recipient, gonAmountReceived.div(_gonsPerFragment));

        if (shouldRebase() && autoRebase) {
            _rebase();

            if (!automatedMarketMakerPairs[sender] && !automatedMarketMakerPairs[recipient]) {
                manualSync();
            }
        }

        return true;
    }

    function transferFrom(address from, address to, uint256 value) external override validRecipient(to) returns (bool) {
        if (_allowedFragments[from][msg.sender] != ~uint256(0)) {
            _allowedFragments[from][msg.sender] = _allowedFragments[from][msg.sender].sub(value, "Insufficient Allowance");
        }

        _transferFrom(from, to, value);
        return true;
    }

    function _swapAndLiquify(uint256 contractTokenBalance) private {
        uint256 half = contractTokenBalance.div(2);
        uint256 otherHalf = contractTokenBalance.sub(half);

        uint256 initialBalance = address(this).balance;

        _swapTokensForAVAX(half, address(this));

        uint256 newBalance = address(this).balance.sub(initialBalance);

        _addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function _addLiquidity(uint256 tokenAmount, uint256 avaxAmount) private {
        router.addLiquidityAVAX{value: avaxAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            liquidityReceiver,
            block.timestamp
        );
    }

    function _swapTokensForAVAX(uint256 tokenAmount, address receiver) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WAVAX();

        router.swapExactTokensForAVAXSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            receiver,
            block.timestamp
        );
    }

    function swapBack() internal swapping {
        uint256 realTotalFee = totalFee[0].add(totalFee[1]).add(totalFee[2]);

        uint256 contractTokenBalance = _gonBalances[address(this)].div(_gonsPerFragment);

        uint256 amountToLiquify = 0;
        if (!isOverLiquified(targetLiquidity, targetLiquidityDenominator))
            amountToLiquify = contractTokenBalance.mul(liquidityFee[0] + liquidityFee[1] + liquidityFee[2]).div(realTotalFee);
        uint256 amountToMagicVault = contractTokenBalance.mul(magicVaultFee[0] + magicVaultFee[1] + magicVaultFee[2]).div(realTotalFee);
        uint256 amountToTreasury = contractTokenBalance.mul(treasuryFee[0] + treasuryFee[1] + treasuryFee[2]).div(realTotalFee);
        uint256 amountToMagicBank = contractTokenBalance.mul(magicBankFee[0] + magicBankFee[1] + magicBankFee[2]).div(realTotalFee);
        uint256 amountToEcosystem = contractTokenBalance.mul(ecosystemFee[0] + ecosystemFee[1] + ecosystemFee[2]).div(realTotalFee);
        uint256 amountToBurn = contractTokenBalance - amountToLiquify - amountToMagicVault - amountToTreasury - amountToMagicBank - amountToEcosystem;

        if (amountToLiquify > 0) {
            _swapAndLiquify(amountToLiquify);
        }

        if (amountToMagicVault > 0) {
            _swapTokensForAVAX(amountToMagicVault, magicVaultReceiver);
        }

        if (amountToTreasury > 0) {
            _swapTokensForAVAX(amountToTreasury, treasuryReceiver);
        }

        if (amountToMagicBank > 0) {
            _swapTokensForAVAX(amountToMagicBank, magicBankReceiver);
        }

        if (amountToEcosystem > 0) {
            _swapTokensForAVAX(amountToEcosystem, futureEcosystemReceiver);
        }

        if (amountToBurn > 0) {
            _basicTransfer (address(this), burnReceiver, amountToBurn);
        }

        emit SwapBack(contractTokenBalance, amountToLiquify, amountToMagicVault, amountToTreasury, amountToMagicBank, amountToEcosystem);
    }

    function takeFee(address sender, address recipient, uint256 gonAmount) internal returns (uint256) {
        uint256 amount = gonAmount.div(_gonsPerFragment);
        uint256 usdcAmount = getUSDCFromMAGIC (amount);

        uint256 _realFee = 0;
        if(automatedMarketMakerPairs[recipient]) {
            _realFee = totalFee[0];
            if (usdcAmount > normalSellLimit) {
                _realFee = totalFee[1];
            }
            else if (usdcAmount > whaleSellLimit) {
                _realFee = totalFee[2];
            }
        }

        uint256 feeAmount = gonAmount.mul(_realFee).div(feeDenominator);

        _gonBalances[address(this)] = _gonBalances[address(this)].add(feeAmount);
        emit Transfer(sender, address(this), feeAmount.div(_gonsPerFragment));
        return gonAmount.sub(feeAmount);
    }

    function getUSDCFromMAGIC(uint256 _amount) public view returns (uint256) {
        address[] memory path = new address[](3);
        path[0] = address(this);
        path[1] = router.WAVAX();
        path[2] = address(usdcAddress);

        uint256[] memory price_out = router.getAmountsOut(_amount, path);
        return price_out[2];
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        uint256 oldValue = _allowedFragments[msg.sender][spender];

        if (subtractedValue >= oldValue) {
            _allowedFragments[msg.sender][spender] = 0;
        } else {
            _allowedFragments[msg.sender][spender] = oldValue.sub(subtractedValue);
        }

        emit Approval(msg.sender, spender, _allowedFragments[msg.sender][spender]);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        _allowedFragments[msg.sender][spender] = _allowedFragments[msg.sender][spender].add(addedValue);
        emit Approval(msg.sender, spender, _allowedFragments[msg.sender][spender]);
        return true;
    }

    function approve(address spender, uint256 value) external override returns (bool) {
        _allowedFragments[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function _rebase() private {
        if (!inSwap) {
            uint256 circulatingSupply = getCirculatingSupply();
            int256 supplyDelta = int256(circulatingSupply.mul(rewardYield).div(rewardYieldDenominator));

            coreRebase(supplyDelta);
        }
    }

    function coreRebase(int256 supplyDelta) private returns (uint256) {
        uint256 epoch = block.timestamp;

        if (supplyDelta == 0) {
            emit LogRebase(epoch, _totalSupply);
            return _totalSupply;
        }

        if (supplyDelta < 0) {
            _totalSupply = _totalSupply.sub(uint256(-supplyDelta));
        } else {
            _totalSupply = _totalSupply.add(uint256(supplyDelta));
        }

        if (_totalSupply > MAX_SUPPLY) {
            _totalSupply = MAX_SUPPLY;
        }

        _gonsPerFragment = TOTAL_GONS.div(_totalSupply);

        nextRebase = epoch + rebaseFrequency;

        emit LogRebase(epoch, _totalSupply);
        return _totalSupply;
    }

    function manualRebase() external onlyOwner {
        require(!inSwap, "Try again");
        require(nextRebase <= block.timestamp, "Not in time");

        uint256 circulatingSupply = getCirculatingSupply();
        int256 supplyDelta = int256(circulatingSupply.mul(rewardYield).div(rewardYieldDenominator));

        coreRebase(supplyDelta);
        manualSync();
    }

    function setAutomatedMarketMakerPair(address _pair, bool _value) public onlyOwner {
        require(automatedMarketMakerPairs[_pair] != _value, "Value already set");

        automatedMarketMakerPairs[_pair] = _value;

        if (_value) {
            _markerPairs.push(_pair);
        } else {
            require(_markerPairs.length > 1, "Required 1 pair");
            for (uint256 i = 0; i < _markerPairs.length; i++) {
                if (_markerPairs[i] == _pair) {
                    _markerPairs[i] = _markerPairs[_markerPairs.length - 1];
                    _markerPairs.pop();
                    break;
                }
            }
        }

        emit SetAutomatedMarketMakerPair(_pair, _value);
    }

    function setInitialDistributionFinished(bool _value) external onlyOwner {
        require(initialDistributionFinished != _value, "Not changed");
        initialDistributionFinished = _value;
    }

    function setFeeExempt(address _addr, bool _value) external onlyOwner {
        require(_isFeeExempt[_addr] != _value, "Not changed");
        _isFeeExempt[_addr] = _value;
    }

    function setTargetLiquidity(uint256 target, uint256 accuracy) external onlyOwner {
        targetLiquidity = target;
        targetLiquidityDenominator = accuracy;
    }

    function setSwapBackSettings(bool _enabled, uint256 _num, uint256 _denom) external onlyOwner {
        swapEnabled = _enabled;
        gonSwapThreshold = TOTAL_GONS.div(_denom).mul(_num);
    }

    function setFeeReceivers(address _liquidityReceiver, address _treasuryReceiver, address _magicVaultReceiver, address _futureEcosystemReceiver, address _magicBankReceiver, address _burnReceiver) external onlyOwner {
        liquidityReceiver = _liquidityReceiver;
        treasuryReceiver = _treasuryReceiver;
        magicVaultReceiver = _magicVaultReceiver;
        magicBankReceiver = _magicBankReceiver;
        futureEcosystemReceiver = _futureEcosystemReceiver;
        burnReceiver = _burnReceiver;
    }

    function setFees(uint8 _feeKind, uint256 _total, uint256 _liquidityFee, uint256 _riskFreeValue, uint256 _treasuryFee, uint256 _feeFee, uint256 _operationFee, uint256 _burnFee) external onlyOwner {
        require (_liquidityFee + _riskFreeValue + _treasuryFee + _feeFee + _operationFee + _burnFee == 100, "subFee is not allowed");

        totalFee[_feeKind] = _total * 100;
        liquidityFee[_feeKind] = _total * _liquidityFee;
        treasuryFee[_feeKind] = _total * _treasuryFee;
        magicVaultFee[_feeKind] = _total * _riskFreeValue;
        ecosystemFee[_feeKind] = _total * _feeFee;
        magicBankFee[_feeKind] = _total * _operationFee;
        burnFee[_feeKind] = _total * _burnFee;
    }

    function clearStuckBalance(address _receiver) external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_receiver).transfer(balance);
    }

    function rescueToken(address tokenAddress, uint256 tokens) external onlyOwner returns (bool success) {
        return ERC20Detailed(tokenAddress).transfer(msg.sender, tokens);
    }
    
    function setRouterAddress(address _router) external onlyOwner {
        router = IDEXRouter(_router);
    }

    function setAutoRebase(bool _autoRebase) external onlyOwner {
        require(autoRebase != _autoRebase, "Not changed");
        autoRebase = _autoRebase;
    }

    function setRebaseFrequency(uint256 _rebaseFrequency) external onlyOwner {
        require(_rebaseFrequency <= MAX_REBASE_FREQUENCY, "Too high");
        rebaseFrequency = _rebaseFrequency;
    }

    function setRewardYield(uint256 _rewardYield, uint256 _rewardYieldDenominator) external onlyOwner {
        rewardYield = _rewardYield;
        rewardYieldDenominator = _rewardYieldDenominator;
    }

    function setFeesOnNormalTransfers(bool _enabled) external onlyOwner {
        require(feesOnNormalTransfers != _enabled, "Not changed");
        feesOnNormalTransfers = _enabled;
    }

    function setNextRebase(uint256 _nextRebase) external onlyOwner {
        nextRebase = _nextRebase;
    }

    function setMaxSellTransaction(uint256 _maxTxn) external onlyOwner {
        maxSellTransactionAmount = _maxTxn;
    }

    function setJustBusiness(address _add, bool _business) external onlyOwner {
        justBusinessList[_add] = _business;
    }

    function setWhaleSellLimit(uint256 _limit) external onlyOwner {
        whaleSellLimit = _limit;
    }

    function setNormalSellLimit(uint256 _limit) external onlyOwner {
        normalSellLimit = _limit;
    }

    event SwapBack(uint256 contractTokenBalance,uint256 amountToLiquify,uint256 amountToMagicVault,uint256 amountToTreasury,uint256 amountToMagicBank,uint256 amountToEcosystem);
    event SwapAndLiquify(uint256 tokensSwapped, uint256 avaxReceived, uint256 tokensIntoLiqudity);
    event LogRebase(uint256 indexed epoch, uint256 totalSupply);
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    receive() payable external {}

    fallback() payable external {}
}