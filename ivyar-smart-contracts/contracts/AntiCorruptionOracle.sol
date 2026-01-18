// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AntiCorruptionOracle is AccessControl, Pausable {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    enum AnomalyType {
        UNUSUAL_ALLOCATION_PATTERN,
        CONFLICT_OF_INTEREST,
        SERVICE_RECORD_MANIPULATION,
        SUSPICIOUS_TIMING,
        RELATED_PARTY_TRANSACTION
    }
    
    enum AnomalySeverity { LOW, MEDIUM, HIGH, CRITICAL }
    enum AnomalyStatus { FLAGGED, UNDER_INVESTIGATION, RESOLVED, CONFIRMED_FRAUD }
    
    struct Anomaly {
        uint256 id;
        AnomalyType anomalyType;
        AnomalySeverity severity;
        AnomalyStatus status;
        address flaggedAddress;
        string cadastralNumber;
        string description;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(uint256 => Anomaly) public anomalies;
    mapping(address => uint256[]) public addressAnomalies;
    mapping(address => bool) public blacklisted;
    
    uint256 public nextAnomalyId = 1;
    uint256 public totalAnomalies;
    uint256 public confirmedFraudCases;
    
    event AnomalyDetected(uint256 indexed anomalyId, AnomalyType anomalyType, AnomalySeverity severity, address indexed flaggedAddress);
    event AddressBlacklisted(address indexed addr, uint256 indexed anomalyId, string reason);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }
    
    function flagAnomaly(
        AnomalyType anomalyType,
        AnomalySeverity severity,
        address flaggedAddress,
        string memory cadastralNumber,
        string memory description
    ) external onlyRole(ORACLE_ROLE) whenNotPaused returns (uint256) {
        uint256 anomalyId = nextAnomalyId++;
        
        anomalies[anomalyId] = Anomaly({
            id: anomalyId,
            anomalyType: anomalyType,
            severity: severity,
            status: AnomalyStatus.FLAGGED,
            flaggedAddress: flaggedAddress,
            cadastralNumber: cadastralNumber,
            description: description,
            timestamp: block.timestamp,
            exists: true
        });
        
        addressAnomalies[flaggedAddress].push(anomalyId);
        totalAnomalies++;
        
        emit AnomalyDetected(anomalyId, anomalyType, severity, flaggedAddress);
        
        return anomalyId;
    }
    
    function confirmFraud(uint256 anomalyId) external onlyRole(ADMIN_ROLE) {
        require(anomalies[anomalyId].exists, "Anomaly not found");
        
        anomalies[anomalyId].status = AnomalyStatus.CONFIRMED_FRAUD;
        confirmedFraudCases++;
        
        address addr = anomalies[anomalyId].flaggedAddress;
        blacklisted[addr] = true;
        
        emit AddressBlacklisted(addr, anomalyId, "Confirmed fraud");
    }
    
    function getRiskScore(address addr) external view returns (uint256) {
        if (blacklisted[addr]) return 100;
        
        uint256[] memory anomalyIds = addressAnomalies[addr];
        if (anomalyIds.length == 0) return 0;
        
        uint256 score = 0;
        for (uint256 i = 0; i < anomalyIds.length; i++) {
            Anomaly memory anomaly = anomalies[anomalyIds[i]];
            
            if (anomaly.status == AnomalyStatus.CONFIRMED_FRAUD) {
                score += 50;
            } else if (anomaly.severity == AnomalySeverity.CRITICAL) {
                score += 30;
            } else if (anomaly.severity == AnomalySeverity.HIGH) {
                score += 20;
            }
        }
        
        return score > 100 ? 100 : score;
    }
    
    function isBlacklisted(address addr) external view returns (bool) {
        return blacklisted[addr];
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
