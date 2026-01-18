import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

interface VeteranProfile {
  nameHash: string;
  combatDays: number;
  serviceYears: number;
  disabilityLevel: number;
  awards: string[];
  priorityScore: number;
  priorityLevel: string;
  grantStatus?: string;
}

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<VeteranProfile>({
    nameHash: 'Олександр П.',
    combatDays: 450,
    serviceYears: 3,
    disabilityLevel: 0,
    awards: ['Орден Мужності'],
    priorityScore: 245,
    priorityLevel: 'БОЙОВИЙ ВЕТЕРАН',
    grantStatus: 'PENDING',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>МІЙ ПРОФІЛЬ</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>ВИХІД</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Priority Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>ВАШ ПРІОРИТЕТ</Text>
          <Text style={styles.scoreValue}>{profile.priorityScore}</Text>
          <Text style={styles.scoreSubtitle}>балів</Text>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{profile.priorityLevel}</Text>
          </View>
        </View>

        {/* Service Record */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>БОЙОВА СЛУЖБА</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.combatDays}</Text>
              <Text style={styles.statLabel}>Днів у бою</Text>
              <Text style={styles.statPoints}>+150 балів</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.serviceYears}</Text>
              <Text style={styles.statLabel}>Років служби</Text>
              <Text style={styles.statPoints}>+0 балів</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.disabilityLevel || 'Немає'}</Text>
              <Text style={styles.statLabel}>Інвалідність</Text>
              <Text style={styles.statPoints}>+0 балів</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.awards.length}</Text>
              <Text style={styles.statLabel}>Нагороди</Text>
              <Text style={styles.statPoints}>+30 балів</Text>
            </View>
          </View>
        </View>

        {/* Awards */}
        {profile.awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>НАГОРОДИ</Text>
            {profile.awards.map((award, index) => (
              <View key={index} style={styles.awardItem}>
                <Text style={styles.awardIcon}>🎖️</Text>
                <Text style={styles.awardText}>{award}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Grant Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СТАТУС ЗАЯВКИ</Text>
          <View style={styles.statusCard}>
            {profile.grantStatus === 'PENDING' && (
              <>
                <Text style={styles.statusLabel}>⏳ НА РОЗГЛЯДІ</Text>
                <Text style={styles.statusText}>
                  Ваша заявка обробляється. Очікуваний час: 1-3 місяці
                </Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => navigation.navigate('Apply')}
                >
                  <Text style={styles.applyButtonText}>ПОДАТИ ЗАЯВКУ НА ЗЕМЛЮ</Text>
                </TouchableOpacity>
              </>
            )}
            {!profile.grantStatus && (
              <>
                <Text style={styles.statusLabel}>📝 ЗАЯВКА НЕ ПОДАНА</Text>
                <Text style={styles.statusText}>
                  Ви можете подати заявку на отримання земельної ділянки
                </Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => navigation.navigate('Apply')}
                >
                  <Text style={styles.applyButtonText}>ПОДАТИ ЗАЯВКУ</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Parcels')}
        >
          <Text style={styles.navButtonText}>🗺️ ПЕРЕГЛЯНУТИ ДОСТУПНІ ДІЛЯНКИ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>📚 НАВЧАЛЬНІ МАТЕРІАЛИ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>📞 ПІДТРИМКА</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Blockchain гарантує прозорість | Корупція неможлива
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#005BBB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD500',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scoreCard: {
    backgroundColor: '#005BBB',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFD500',
    marginTop: 8,
  },
  scoreSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: -8,
  },
  priorityBadge: {
    backgroundColor: '#FFD500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 16,
    letterSpacing: 1,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#005BBB',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  statPoints: {
    fontSize: 12,
    color: '#FFD500',
    fontWeight: 'bold',
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  awardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  awardText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 20,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  navButton: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD500',
  },
  navButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
