// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VeteranLandGrant is AccessControl, ReentrancyGuard, Pausable {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    
    enum GrantStatus { PENDING, UNDER_REVIEW, APPROVED, ALLOCATED, REJECTED }
    enum PriorityLevel { STANDARD, DEMOBILIZED, LONG_SERVICE, DISABLED_VETERAN, COMBAT_VETERAN }
    
    struct VeteranServiceRecord {
        uint256 combatDays;
        uint8 disabilityLevel;
        uint256 serviceYears;
        string[] awards;
        bool verified;
    }
    
    struct GrantApplication {
        address veteran;
        string preferredOblast;
        uint256 preferredAreaMin;
        uint256 preferredAreaMax;
        uint256 priorityScore;
        PriorityLevel priorityLevel;
        GrantStatus status;
        uint256 submittedDate;
        string allocatedCadastralNumber;
        bool exists;
    }
    
    mapping(address => VeteranServiceRecord) public serviceRecords;
    mapping(address => GrantApplication) public applications;
    mapping(string => uint256) public awardPoints;
    
    address[] public allApplicants;
    uint256 public totalApplications;
    uint256 public totalAllocated;
    
    event ServiceRecordRegistered(address indexed veteran, uint256 combatDays, uint8 disabilityLevel, uint256 serviceYears);
    event ApplicationSubmitted(address indexed veteran, uint256 priorityScore, PriorityLevel priorityLevel);
    event GrantAllocated(address indexed veteran, string cadastralNumber);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(REVIEWER_ROLE, msg.sender);
        
        awardPoints["Hero of Ukraine"] = 50;
        awardPoints["Order of Courage"] = 30;
        awardPoints["Medal For Courage"] = 25;
    }
    
    function registerServiceRecord(
        address veteran,
        uint256 combatDays,
        uint8 disabilityLevel,
        uint256 serviceYears,
        string[] memory awards
    ) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(veteran != address(0), "Invalid veteran address");
        require(!serviceRecords[veteran].verified, "Already registered");
        
        serviceRecords[veteran] = VeteranServiceRecord({
            combatDays: combatDays,
            disabilityLevel: disabilityLevel,
            serviceYears: serviceYears,
            awards: awards,
            verified: true
        });
        
        emit ServiceRecordRegistered(veteran, combatDays, disabilityLevel, serviceYears);
    }
    
    function calculatePriorityScore(address veteran) public view returns (uint256) {
        require(serviceRecords[veteran].verified, "Service record not verified");
        
        VeteranServiceRecord memory record = serviceRecords[veteran];
        uint256 score = 0;
        
        if (record.combatDays > 0) {
            score += 100;
            if (record.combatDays >= 365) score += 30;
            if (record.combatDays >= 730) score += 20;
        }
        
        if (record.disabilityLevel > 0) {
            score += 50 + (uint256(record.disabilityLevel) * 8);
        }
        
        if (record.serviceYears >= 5) score += 20;
        if (record.serviceYears >= 10) score += 10;
        if (record.serviceYears >= 20) score += 10;
        
        for (uint256 i = 0; i < record.awards.length; i++) {
            score += awardPoints[record.awards[i]];
        }
        
        return score;
    }
    
    function submitApplication(
        string memory preferredOblast,
        uint256 preferredAreaMin,
        uint256 preferredAreaMax
    ) external whenNotPaused nonReentrant {
        require(serviceRecords[msg.sender].verified, "Service record not verified");
        require(!applications[msg.sender].exists, "Already applied");
        
        uint256 score = calculatePriorityScore(msg.sender);
        PriorityLevel level = score >= 200 ? PriorityLevel.COMBAT_VETERAN :
                              score >= 100 ? PriorityLevel.DISABLED_VETERAN :
                              score >= 40 ? PriorityLevel.LONG_SERVICE :
                              score >= 20 ? PriorityLevel.DEMOBILIZED :
                              PriorityLevel.STANDARD;
        
        applications[msg.sender] = GrantApplication({
            veteran: msg.sender,
            preferredOblast: preferredOblast,
            preferredAreaMin: preferredAreaMin,
            preferredAreaMax: preferredAreaMax,
            priorityScore: score,
            priorityLevel: level,
            status: GrantStatus.PENDING,
            submittedDate: block.timestamp,
            allocatedCadastralNumber: "",
            exists: true
        });
        
        allApplicants.push(msg.sender);
        totalApplications++;
        
        emit ApplicationSubmitted(msg.sender, score, level);
    }
    
    function allocateGrant(address veteran, string memory cadastralNumber) 
        external onlyRole(ADMIN_ROLE) {
        require(applications[veteran].exists, "Application not found");
        
        applications[veteran].status = GrantStatus.ALLOCATED;
        applications[veteran].allocatedCadastralNumber = cadastralNumber;
        totalAllocated++;
        
        emit GrantAllocated(veteran, cadastralNumber);
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
