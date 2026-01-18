// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract LandParcelRegistry is AccessControl, ReentrancyGuard, Pausable {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    
    enum ParcelStatus { AVAILABLE, RESERVED, ALLOCATED, DISPUTED }
    
    struct LandParcel {
        string cadastralNumber;
        string oblast;
        uint256 area;
        uint256 marketValue;
        ParcelStatus status;
        address allocatedTo;
        uint256 allocationDate;
        string coordinates;
        string soilQuality;
        bool exists;
    }
    
    mapping(string => LandParcel) public parcels;
    mapping(address => string[]) public veteranParcels;
    
    string[] public allCadastralNumbers;
    uint256 public totalParcels;
    uint256 public totalAllocated;
    
    event ParcelRegistered(string indexed cadastralNumber, string oblast, uint256 area, uint256 marketValue);
    event ParcelAllocated(string indexed cadastralNumber, address indexed veteran, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }
    
    function registerParcel(
        string memory cadastralNumber,
        string memory oblast,
        uint256 area,
        uint256 marketValue,
        string memory coordinates,
        string memory soilQuality
    ) external onlyRole(REGISTRAR_ROLE) whenNotPaused {
        require(!parcels[cadastralNumber].exists, "Parcel already exists");
        
        parcels[cadastralNumber] = LandParcel({
            cadastralNumber: cadastralNumber,
            oblast: oblast,
            area: area,
            marketValue: marketValue,
            status: ParcelStatus.AVAILABLE,
            allocatedTo: address(0),
            allocationDate: 0,
            coordinates: coordinates,
            soilQuality: soilQuality,
            exists: true
        });
        
        allCadastralNumbers.push(cadastralNumber);
        totalParcels++;
        
        emit ParcelRegistered(cadastralNumber, oblast, area, marketValue);
    }
    
    function allocateParcel(
        string memory cadastralNumber,
        address veteran,
        uint256 cultivationYears,
        uint256 noSaleYears,
        bool noLeaseToCorporations
    ) external onlyRole(ADMIN_ROLE) whenNotPaused nonReentrant {
        require(veteran != address(0), "Invalid veteran address");
        require(parcels[cadastralNumber].exists, "Parcel does not exist");
        require(parcels[cadastralNumber].status == ParcelStatus.AVAILABLE, "Parcel not available");
        
        LandParcel storage parcel = parcels[cadastralNumber];
        parcel.status = ParcelStatus.ALLOCATED;
        parcel.allocatedTo = veteran;
        parcel.allocationDate = block.timestamp;
        
        veteranParcels[veteran].push(cadastralNumber);
        totalAllocated++;
        
        emit ParcelAllocated(cadastralNumber, veteran, block.timestamp);
    }
    
    function getParcel(string memory cadastralNumber) external view returns (LandParcel memory) {
        require(parcels[cadastralNumber].exists, "Parcel does not exist");
        return parcels[cadastralNumber];
    }
    
    function getVeteranParcels(address veteran) external view returns (string[] memory) {
        return veteranParcels[veteran];
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
