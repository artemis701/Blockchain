// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./ERC1155Tradable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract OnehundredFactory is Ownable,ERC1155Receiver {
    using Counters for Counters.Counter;

    struct SaleInfo {
        uint256 tokenId;
        string tokenHash;
        address creator;
        address currentOwner;
        uint256 startPrice;
        address maxBidder;
        uint256 maxBid;
        uint256 startTime;
        uint256 interval;
        uint8 kindOfCoin;
        bool _isOnSale;
    }

    struct RoyaltyInfo {
        uint256 totalAmount;
        uint256 sellerAmount;
        uint256 artistAmount;
        uint256 hundredTeamAmount;
        address hundredTeamAddress;
        uint256 devTeamAmount;
        address devTeamAddress;
    }

    struct BidInfo{
        address sender;
        address seller;
        address maxBidder;
        uint256 maxBidPrice;
        string tokenHash;
        uint256 tokenId;
    }
    
    enum AuctionState { 
        OPEN,
        CANCELLED,
        ENDED,
        DIRECT_BUY
    }

    bool _status;
    bool _isMinting;
    uint256 _royaltyIdCounter;
    mapping(uint => RoyaltyInfo) _allRoyaltyInfo;
    mapping(address => uint256) _mintingFees;

    address _withdrawToken;
    address mkNFTaddress;
    ERC1155Tradable mkNFT;

    uint256 _saleId;
    uint256 _maxTokenId;
    
    mapping(uint => SaleInfo) public _allSaleInfo;
    mapping(string => uint) public _getSaleId;
    mapping(string => bool) public _tokenHashExists;
    mapping(address => uint8) public _isCreator;

    mapping(string => uint256) public _getNFTId;
    mapping(uint256 => string) public _uriFromId;

    modifier noOnlyNFTSeller(string memory _tokenHash) {
        require(_allSaleInfo[_getSaleId[_tokenHash]].currentOwner != msg.sender, "just NFT seller");
        _;
    }

    modifier onlyNFTSeller(string memory _tokenHash) {
        require(_allSaleInfo[_getSaleId[_tokenHash]].currentOwner == msg.sender || owner() == msg.sender, "not NFT owner");
        _;
    }

    modifier onlyNFTOwner(string memory tokenHash) {        
        require(mkNFT.balanceOf(msg.sender, _getNFTId[tokenHash]) > 0, "no NFT owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != true, "ReentrancyGuard: reentrant call");
        _status = true;
        _;
        _status = false;
    }

    constructor(address _nftAddress) {
        mkNFTaddress = _nftAddress;
        mkNFT = ERC1155Tradable(_nftAddress);
        _saleId = 0;
        _status = false;
        _isMinting = false;
        _maxTokenId = 1;

        RoyaltyInfo memory info;
        info.sellerAmount = 8750;
        info.artistAmount = 722;
        info.hundredTeamAmount = 437;
        info.hundredTeamAddress = 0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1;       // please let me know
        info.devTeamAmount = 91;
        info.devTeamAddress = 0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1;

        setRoyalty(info);
    }

    function _createOrMint(
        address nftAddress,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) internal {
        ERC1155Tradable tradable = ERC1155Tradable(nftAddress);

        require(!tradable.exists(_id), "Already exist id");
        tradable.create(address(this), _id, _amount, "", _data);

        uint256[] memory ids = new uint256[](1);
        ids[0] = _id;
        tradable.setCreator(_to, ids);
    }

    function mintSingleNFT(string memory _tokenHash) internal {
        require(!_tokenHashExists[_tokenHash], "Existing NFT hash value....");
        _createOrMint(mkNFTaddress, msg.sender, _maxTokenId, 1, "");
        _getNFTId[_tokenHash] = _maxTokenId;
        _setTokenUri(_maxTokenId, _tokenHash);
        _maxTokenId++;
        _tokenHashExists[_tokenHash] = true;
        _isMinting = true;
    }

    function mintMultipleNFT(string[] memory _tokenHashs) internal {
        for (uint256 i = 0; i < _tokenHashs.length; i++) {
            mintSingleNFT(_tokenHashs[i]);
        }
        _isMinting = true;
    }

    function createSaleReal(string memory _tokenHash, uint _interval, uint _price, uint8 _kind) public returns (bool) {
        require(_interval >= 0, "Invalid auction interval.");
        require(_tokenHashExists[_tokenHash], "Non-Existing NFT hash value.");
        require(_price > 0, "Price is zero");
        uint256 tokenId = _getNFTId[_tokenHash];
        SaleInfo memory saleInfo;
        if (!_isMinting) {
            mkNFT.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        }
        saleInfo = SaleInfo(_saleId, _tokenHash, mkNFT.creators(tokenId), msg.sender, _price, address(0), 0, block.timestamp, _interval, _kind, true);

        _allSaleInfo[_saleId] = saleInfo;
        _getSaleId[_tokenHash] = _saleId;
        _saleId++;
        return true;
    }

    function singleMintOnSale(string memory _tokenHash, uint _interval, uint _price, uint8 _kind) external payable {
        require(msg.value >= _mintingFees[msg.sender], "insufficient minting fee");
        uint256 tokenId = _getNFTId[_tokenHash];
        if(mkNFT.balanceOf(msg.sender, tokenId) == 0) {
            mintSingleNFT(_tokenHash);
            emit MintSingleNFT(_tokenHash, _getNFTId[_tokenHash]);
        }
        createSaleReal(_tokenHash, _interval, _price, _kind);
        emit SingleMintOnSale(msg.sender, _tokenHash, tokenId, _interval, _price, _kind);
        _isMinting = false;
    }

    function batchMintOnSale(string[] memory _tokenHashs, uint _interval, uint _price, uint8 _kind) external payable {
        uint256[] memory tokenIds = new uint256[](_tokenHashs.length);
        mintMultipleNFT(_tokenHashs);
        for (uint256 i = 0; i < _tokenHashs.length; i++) {
            tokenIds[i] = _getNFTId[_tokenHashs[i]];
            createSaleReal(_tokenHashs[i], _interval, _price, _kind);
        }
        emit BatchMintOnSale(msg.sender, _tokenHashs, tokenIds, _interval, _price, _kind);
        _isMinting = false;
    }

    function destroySale(string memory _tokenHash) external onlyNFTSeller(_tokenHash) nonReentrant returns (bool) {
        require(_tokenHashExists[_tokenHash], "Non-Existing NFT hash value....");
        require(getAuctionState(_tokenHash) != AuctionState.CANCELLED, "Auction state is already cancelled...");

        if (_allSaleInfo[_getSaleId[_tokenHash]].maxBid != 0) {
            customizedTransfer(payable(_allSaleInfo[_getSaleId[_tokenHash]].maxBidder), _allSaleInfo[_getSaleId[_tokenHash]].maxBid, _allSaleInfo[_getSaleId[_tokenHash]].kindOfCoin);
        }

        mkNFT.safeTransferFrom(address(this), _allSaleInfo[_getSaleId[_tokenHash]].currentOwner, _getNFTId[_tokenHash], 1, "");
        _allSaleInfo[_getSaleId[_tokenHash]]._isOnSale = false;
        emit DestroySale(_allSaleInfo[_getSaleId[_tokenHash]].currentOwner, _tokenHash, _getNFTId[_tokenHash]);
    
        return true;
    }

    function placeBidReal(string memory _tokenHash) internal noOnlyNFTSeller(_tokenHash) returns(address bidder, uint256 price, string memory tokenHash, uint256 tokenId){
        require(_tokenHashExists[_tokenHash], "Non-Existing NFT hash value....");

        address lastHightestBidder = _allSaleInfo[_getSaleId[_tokenHash]].maxBidder;
        uint256 lastHighestBid = _allSaleInfo[_getSaleId[_tokenHash]].maxBid;
        _allSaleInfo[_getSaleId[_tokenHash]].maxBid = msg.value;
        _allSaleInfo[_getSaleId[_tokenHash]].maxBidder = msg.sender;

        if (lastHighestBid != 0) {
            customizedTransfer(payable(lastHightestBidder), lastHighestBid, _allSaleInfo[_getSaleId[_tokenHash]].kindOfCoin);
        }
        return (msg.sender, msg.value, _tokenHash, _getNFTId[_tokenHash]);
    }

    function placeBid(string memory _tokenHash) payable external nonReentrant noOnlyNFTSeller(_tokenHash) returns (bool) {
        address bidder;
        uint256 price;
        string memory tokenHash;
        uint256 tokenId;
        require(getAuctionState(_tokenHash) == AuctionState.OPEN, "Auction state is not open.");
        require(msg.value > _allSaleInfo[_getSaleId[_tokenHash]].startPrice, "less than start price");
        require(msg.value > _allSaleInfo[_getSaleId[_tokenHash]].maxBid, "less than max bid price");
        
        (bidder, price, tokenHash, tokenId) = placeBidReal(_tokenHash);
        emit PlaceBid(bidder, price, tokenHash, tokenId);
        return true;
    }

    function endBidReal(string memory _tokenHash) internal returns(BidInfo memory bidInfos, RoyaltyInfo memory royaltyInfos){
        require(_tokenHashExists[_tokenHash], "Non-Existing NFT hash value.");
        SaleInfo memory saleInfo = _allSaleInfo[_getSaleId[_tokenHash]];
        RoyaltyInfo memory royaltyInfo = _allRoyaltyInfo[_royaltyIdCounter];
        royaltyInfo.artistAmount = saleInfo.maxBid * royaltyInfo.artistAmount / royaltyInfo.totalAmount;
        royaltyInfo.hundredTeamAmount = saleInfo.maxBid * royaltyInfo.hundredTeamAmount / royaltyInfo.totalAmount;
        royaltyInfo.devTeamAmount = saleInfo.maxBid * royaltyInfo.devTeamAmount / royaltyInfo.totalAmount;
        royaltyInfo.sellerAmount = saleInfo.maxBid - royaltyInfo.artistAmount - royaltyInfo.hundredTeamAmount - royaltyInfo.devTeamAmount;

        if(saleInfo.maxBidder != address(0)) {
            mkNFT.safeTransferFrom(address(this), saleInfo.maxBidder, _getNFTId[_tokenHash], 1, "");
        } else {
            mkNFT.safeTransferFrom(address(this), saleInfo.currentOwner, _getNFTId[_tokenHash], 1, "");        
        }

        if(royaltyInfo.artistAmount > 0) {
            customizedTransfer(payable(saleInfo.creator), royaltyInfo.artistAmount, saleInfo.kindOfCoin);
        }
        if(royaltyInfo.hundredTeamAmount > 0) {
            customizedTransfer(payable(royaltyInfo.hundredTeamAddress), royaltyInfo.hundredTeamAmount, saleInfo.kindOfCoin);
        }
        if(royaltyInfo.devTeamAmount > 0) {
            customizedTransfer(payable(royaltyInfo.devTeamAddress), royaltyInfo.devTeamAmount, saleInfo.kindOfCoin);
        }
        if(royaltyInfo.sellerAmount > 0) {
            customizedTransfer(payable(saleInfo.currentOwner), royaltyInfo.sellerAmount, saleInfo.kindOfCoin);
        }

        BidInfo memory bidInfo;
        bidInfo = BidInfo(msg.sender, saleInfo.currentOwner, saleInfo.maxBidder, saleInfo.maxBid, _tokenHash, _getNFTId[_tokenHash]);

        saleInfo.currentOwner = saleInfo.maxBidder;
        saleInfo.startPrice = saleInfo.maxBid;
        saleInfo._isOnSale = false;

        _allSaleInfo[_getSaleId[_tokenHash]] = saleInfo;
        return (bidInfo, royaltyInfo);
    }

    function buyNow(string memory _tokenHash) payable external nonReentrant{
        RoyaltyInfo memory royaltyInfo;
        require(getAuctionState(_tokenHash) == AuctionState.DIRECT_BUY, "Auction state is not buy now");
        require(msg.value == _allSaleInfo[_getSaleId[_tokenHash]].startPrice, "not equal price");
        placeBidReal(_tokenHash);
        BidInfo memory bidInfo;
        (bidInfo, royaltyInfo) = endBidReal(_tokenHash);
        emit BuyNow(bidInfo.sender, bidInfo.seller, bidInfo.maxBidder, bidInfo.maxBidPrice, bidInfo.tokenHash, bidInfo.tokenId, royaltyInfo);
    }

    function acceptOrEndBid(string memory _tokenHash) external nonReentrant returns (bool) {
        RoyaltyInfo memory royaltyInfo;
        BidInfo memory bidInfo;
        bool isAccept = msg.sender == _allSaleInfo[_getSaleId[_tokenHash]].currentOwner;
        if(isAccept) {
            require(getAuctionState(_tokenHash) == AuctionState.OPEN || getAuctionState(_tokenHash) == AuctionState.ENDED, "Auction state is not open or end.");
        } else {
            require(getAuctionState(_tokenHash) == AuctionState.ENDED, "Auction state is not ended.");
        }
        (bidInfo, royaltyInfo) = endBidReal(_tokenHash);
        if(isAccept) {
            emit AcceptBid(msg.sender, bidInfo, royaltyInfo);
        } else {
            emit EndBid(msg.sender, bidInfo, royaltyInfo);
        }
        return true;
    }

    function batchEndAuction(string[] memory _tokenHashs) external nonReentrant returns (bool) {
        RoyaltyInfo[] memory royaltyInfos = new RoyaltyInfo[](_tokenHashs.length);
        BidInfo[] memory bidInfos = new BidInfo[](_tokenHashs.length);
        for(uint256 i=0; i<_tokenHashs.length; i++) {
            if(getAuctionState(_tokenHashs[i]) != AuctionState.ENDED) continue;
            RoyaltyInfo memory royaltyInfo;
            BidInfo memory bidInfo;
            (bidInfo, royaltyInfo) = endBidReal(_tokenHashs[i]);
            royaltyInfos[i] = royaltyInfo;
            bidInfos[i] = bidInfo;
        }
        emit BatchEndAuction(msg.sender, bidInfos, royaltyInfos);
        return true;
    }

    function getAuthentication(address _addr) external view returns (uint8) {
        require(_addr != address(0), "Invalid input address...");
        return _isCreator[_addr];
    }

    function getAuctionState(string memory _tokenHash) public view returns (AuctionState) {
        if (!_allSaleInfo[_getSaleId[_tokenHash]]._isOnSale) return AuctionState.CANCELLED;
        if (_allSaleInfo[_getSaleId[_tokenHash]].interval == 0) return AuctionState.DIRECT_BUY;
        if (block.timestamp >= _allSaleInfo[_getSaleId[_tokenHash]].startTime + _allSaleInfo[_getSaleId[_tokenHash]].interval) return AuctionState.ENDED;
        return AuctionState.OPEN;
    } 

    function getSaleInfo(string memory _tokenHash) public view returns (SaleInfo memory) {
        require(_tokenHashExists[_tokenHash], "Non-Existing NFT hash value....");

        return _allSaleInfo[_getSaleId[_tokenHash]];
    }

    function getWithdrawBalance(uint8 _kind) public view returns (uint256) {
        if(_kind == 0) {
            return address(this).balance;
        }
        if(_withdrawToken == address(0)) return 0;
        IERC20 token = IERC20(_withdrawToken);
        return token.balanceOf(address(this));
    }

    function setAuthentication(address _addr, uint8 _flag) public onlyOwner {
        require(_addr != address(0), "Invalid input address...");
        _isCreator[_addr] = _flag;
        emit SetAuthentication(msg.sender, _addr, _flag);
    }

    function setMintingFee(address _creator, uint256 _amount) external onlyOwner {
        require(_creator != address(0), "Invalid input address...");
        require(_amount >= 0, "Too small amount");
        _mintingFees[_creator] = _amount;
        emit SetMintingFee(msg.sender, _creator, _amount);
    }

    function getRoyalty() external view returns(RoyaltyInfo memory){
        return _allRoyaltyInfo[_royaltyIdCounter];
    }

    function setRoyalty(RoyaltyInfo memory info) public onlyOwner {
        require(info.hundredTeamAddress != address(0), "invalid hundredTeam address");
        require(info.devTeamAddress != address(0), "invalid developer address");
        info.totalAmount = info.sellerAmount + info.artistAmount + info.hundredTeamAmount + info.devTeamAmount;
        require(info.totalAmount > 0, "invalid parameter");
        _royaltyIdCounter++;
        _allRoyaltyInfo[_royaltyIdCounter] = info;
        emit SetRoyalty(msg.sender, info);
    }

    function customizedTransfer(address payable _to, uint256 _amount, uint8 _kind) internal {
        require(_to != address(0), "Invalid address...");
        if(_amount > 0) {
            if (_kind == 0) {
                _to.transfer(_amount);
            } else {
                if(_withdrawToken == address(0)) return;
                IERC20 token = IERC20(_withdrawToken);
                token.transfer(_to, _amount);
            }
        }
    }

    function withDraw(uint256 _amount, uint8 _kind) external onlyOwner {
        require(_amount > 0, "Invalid withdraw amount...");
        require(_kind >= 0, "Invalid cryptocurrency...");
        require(getWithdrawBalance(_kind) > _amount, "None left to withdraw...");

        customizedTransfer(payable(msg.sender), _amount, _kind);
    }

    function withDrawAll(uint8 _kind) external onlyOwner {
        require(_kind >= 0, "Invalid cryptocurrency...");
        uint256 remaining = getWithdrawBalance(_kind);
        require(remaining > 0, "None left to withdraw...");

        customizedTransfer(payable(msg.sender), remaining, _kind);
    }

    function _setTokenUri(uint256 _tokenId, string memory _uri) internal {
        _uriFromId[_tokenId] = _uri;
        emit SetTokenUri(_tokenId, _uri);
    }

    function transferNFTOwner(address to) external onlyOwner {
        mkNFT.transferOwnership(to);
        emit TransferNFTOwner(msg.sender, to);
    }

    function transferNFT(address to, string memory tokenHash) external onlyNFTOwner(tokenHash){
        mkNFT.safeTransferFrom(msg.sender, to, _getNFTId[tokenHash], 1, "");
        emit TransferNFT(msg.sender, to, tokenHash, _getNFTId[tokenHash]);
    }

    function transferNFTFrom(address from, address to, uint256 tokenId) external onlyOwner{
        mkNFT.safeTransferFrom(from, to, tokenId, 1, "");
    }

    function changePrice(string memory tokenHash, uint256 newPrice) external onlyNFTSeller(tokenHash){
        uint256 saleId = _getSaleId[tokenHash];
        require(getAuctionState(tokenHash) == AuctionState.DIRECT_BUY || (getAuctionState(tokenHash) == AuctionState.OPEN && _allSaleInfo[saleId].maxBidder == address(0)), "can't change price");
        uint256 oldPrice = _allSaleInfo[saleId].startPrice;
        _allSaleInfo[saleId].startPrice = newPrice;
        emit ChangePrice(msg.sender, tokenHash, oldPrice, newPrice, _allSaleInfo[saleId].interval);
    }

    function burnNFT(string memory tokenHash) external onlyNFTOwner(tokenHash){
        mkNFT.burnNFT(msg.sender, _getNFTId[tokenHash], 1);
        emit BurnNFT(msg.sender, tokenHash, _getNFTId[tokenHash]);
    }

    function getNFTAddress() external view returns(address nftAddress) {
        return mkNFTaddress;
    }

    function setNFTAddress(address nftAddress) external onlyOwner {
        mkNFTaddress = nftAddress;
        mkNFT = ERC1155Tradable(nftAddress);
        emit SetNFTAddress(msg.sender, nftAddress);
    }

    function getSaleId() external view returns(uint256){
        return _saleId;
    }

    function setSaleId(uint256 saleId) external onlyOwner{
        _saleId = saleId;
    }

    function getMaxTokenId() external view returns(uint256) {
        return _maxTokenId;
    }

    function setMaxTokenId(uint256 maxTokenId) external onlyOwner {
        _maxTokenId = maxTokenId;
        emit SetMaxTokenId(msg.sender, maxTokenId);
    }

    function getBalanceOf(address user, string memory tokenHash, address nftAddress) external view returns(uint256) {
        ERC1155Tradable nft;
        if(nftAddress == address(0)) {
            nft = ERC1155Tradable(mkNFTaddress);
        } else {
            nft = ERC1155Tradable(nftAddress);
        }
        return nft.balanceOf(user, _getNFTId[tokenHash]);
    }

    function getWithdrawToken() external view returns(address) {
        return _withdrawToken;
    }

    function setWithdrawToken(address token) external onlyOwner {
        _withdrawToken = token;
        emit SetWithdrawToken(msg.sender, token);
    }

    receive() payable external {

    }

    fallback() payable external {

    }
    
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    event MintSingleNFT(string tokenHash, uint256 tokenId);
    event SingleMintOnSale(address seller, string tokenHash, uint256 tokenId, uint256 interval, uint256 price, uint8 kind);
    event BatchMintOnSale(address seller, string[] tokenHashs, uint256[] tokenIds, uint256 interval, uint256 price, uint8 kind);
    event DestroySale(address seller, string tokenHash, uint256 tokenId);
    event PlaceBid(address bidder, uint256 price, string tokenHash, uint256 tokenId);
    event AcceptBid(address caller, BidInfo bidInfo, RoyaltyInfo royaltyInfo);
    event EndBid(address caller, BidInfo bidInfo, RoyaltyInfo royaltyInfo);
    event BatchEndAuction(address caller, BidInfo[] bidInfos, RoyaltyInfo[] royaltyInfos);
    event BuyNow(address caller, address seller, address buyer, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event SetAuthentication(address sender, address addr, uint256 flag);
    event SetMintingFee(address sender, address creator, uint256 amount);
    event SetRoyalty(address sender, RoyaltyInfo info);
    event TransferNFTOwner(address sender, address to);
    event ChangePrice(address sender,string tokenHash, uint256 oldPrice, uint256 newPrice, uint256 interval);
    event TransferNFT(address sender, address receiver, string tokenHash, uint256 tokenId);
    event BurnNFT(address sender, string tokenHash, uint256 tokenId);
    event SetNFTAddress(address sender, address nftAddress);
    event SetTokenUri(uint256 tokenId, string uri);
    event SetMaxTokenId(address sender, uint256 maxTokenId);
    event SetWithdrawToken(address sender, address token);
}