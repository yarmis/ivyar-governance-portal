import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';

interface GrantApplication {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'ALLOCATED' | 'REJECTED';
  submittedDate: string;
  priorityScore: number;
  priorityLevel: string;
  estimatedWaitMonths: number;
  preferredOblast: string;
  preferredArea: { min: number; max: number };
  queuePosition?: number;
  totalInQueue?: number;
  reviewNotes?: string;
  allocatedParcelId?: string;
}

interface StatusTimeline {
  date: string;
  status: string;
  description: string;
  completed: boolean;
}

export default function GrantStatusScreen({ navigation }: any) {
  const [grant, setGrant] = useState<GrantApplication | null>(null);
  const [timeline, setTimeline] = useState<StatusTimeline[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGrantStatus = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(
      //   `https://ivyar-ddr-module.vercel.app/api/land/veteran-grants/${grantId}`
      // );
      
      // Mock data
      setTimeout(() => {
        setGrant({
          id: 'VLG-2026-00123',
          status: 'UNDER_REVIEW',
          submittedDate: '2026-01-15',
          priorityScore: 245,
          priorityLevel: 'БОЙОВИЙ ВЕТЕРАН',
          estimatedWaitMonths: 2,
          preferredOblast: 'Чернігівська',
          preferredArea: { min: 5, max: 10 },
          queuePosition: 45,
          totalInQueue: 287,
          reviewNotes: 'Документи перевірені. Очікується виділення ділянки.',
        });

        setTimeline([
          {
            date: '2026-01-15',
            status: 'SUBMITTED',
            description: 'Заявку подано',
            completed: true,
          },
          {
            date: '2026-01-18',
            status: 'DOCUMENTS_VERIFIED',
            description: 'Документи перевірені',
            completed: true,
          },
          {
            date: '2026-01-20',
            status: 'PRIORITY_CALCULATED',
            description: 'Пріоритет розраховано (245 балів)',
            completed: true,
          },
          {
            date: '~2026-02-15',
            status: 'UNDER_REVIEW',
            description: 'Розгляд і підбір ділянки',
            completed: false,
          },
          {
            date: '~2026-03-01',
            status: 'LOTTERY',
            description: 'Лотерея розподілу',
            completed: false,
          },
          {
            date: '~2026-03-15',
            status: 'ALLOCATED',
            description: 'Земля виділена',
            completed: false,
          },
        ]);

        setLoading(false);
        setRefreshing(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching grant status:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGrantStatus();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGrantStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#999';
      case 'UNDER_REVIEW':
        return '#FFD500';
      case 'APPROVED':
        return '#00AA00';
      case 'ALLOCATED':
        return '#005BBB';
      case 'REJECTED':
        return '#FF0000';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳ НА РОЗГЛЯДІ';
      case 'UNDER_REVIEW':
        return '🔍 ПЕРЕВІРЯЄТЬСЯ';
      case 'APPROVED':
        return '✅ СХВАЛЕНО';
      case 'ALLOCATED':
        return '🎉 ВИДІЛЕНО';
      case 'REJECTED':
        return '❌ ВІДХИЛЕНО';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.startsWith('~')) {
      return `Очікується: ${dateString.slice(1)}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  if (!grant) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Заявка не знайдена</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>НАЗАД</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← НАЗАД</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>СТАТУС ЗАЯВКИ</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFD500"
          />
        }
      >
        
        {/* Status Badge */}
        <View style={styles.statusBanner}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(grant.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(grant.status)}</Text>
          </View>
          <Text style={styles.grantId}>№ {grant.id}</Text>
        </View>

        {/* Priority Score */}
        <View style={styles.priorityCard}>
          <Text style={styles.priorityLabel}>ВАШ ПРІОРИТЕТ</Text>
          <Text style={styles.priorityScore}>{grant.priorityScore}</Text>
          <Text style={styles.priorityLevel}>{grant.priorityLevel}</Text>
          
          {grant.queuePosition && grant.totalInQueue && (
            <View style={styles.queueInfo}>
              <Text style={styles.queueText}>
                📊 Позиція в черзі: {grant.queuePosition} з {grant.totalInQueue}
              </Text>
              <View style={styles.queueBar}>
                <View
                  style={[
                    styles.queueProgress,
                    {
                      width: `${((grant.totalInQueue - grant.queuePosition) / grant.totalInQueue) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Application Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 ДЕТАЛІ ЗАЯВКИ</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Дата подання:</Text>
              <Text style={styles.detailValue}>{formatDate(grant.submittedDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Бажана область:</Text>
              <Text style={styles.detailValue}>{grant.preferredOblast}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Бажана площа:</Text>
              <Text style={styles.detailValue}>
                {grant.preferredArea.min}-{grant.preferredArea.max} га
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Очікування:</Text>
              <Text style={styles.detailValue}>~{grant.estimatedWaitMonths} міс</Text>
            </View>
          </View>
        </View>

        {/* Review Notes */}
        {grant.reviewNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💬 КОМЕНТАРІ</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{grant.reviewNotes}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 ХРОНОЛОГІЯ</Text>
          <View style={styles.timeline}>
            {timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      item.completed && styles.timelineDotCompleted,
                    ]}
                  />
                  {index < timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        item.completed && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineDescription,
                      item.completed && styles.timelineDescriptionCompleted,
                    ]}
                  >
                    {item.description}
                  </Text>
                  <Text style={styles.timelineDate}>{formatDate(item.date)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        {grant.status === 'ALLOCATED' && grant.allocatedParcelId && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MyLand')}
          >
            <Text style={styles.primaryButtonText}>🏡 ПЕРЕГЛЯНУТИ МОЮ ЗЕМЛЮ</Text>
          </TouchableOpacity>
        )}

        {grant.status === 'PENDING' && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Apply')}
          >
            <Text style={styles.secondaryButtonText}>✏️ РЕДАГУВАТИ ЗАЯВКУ</Text>
          </TouchableOpacity>
        )}

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>❓ ПОТРІБНА ДОПОМОГА?</Text>
          <Text style={styles.helpText}>
            Якщо у вас є питання щодо вашої заявки, зв'яжіться з нами:
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>📞 ЗВ'ЯЗАТИСЯ З ПІДТРИМКОЮ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🔐 Blockchain гарантує прозорість | Оновлюється щодня
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#005BBB',
  },
  backButton: {
    fontSize: 14,
    color: '#FFD500',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statusBanner: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  grantId: {
    fontSize: 13,
    fontFamily: 'Courier New',
    color: '#999',
  },
  priorityCard: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  priorityLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priorityScore: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFD500',
    marginBottom: 8,
  },
  priorityLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  queueInfo: {
    width: '100%',
    marginTop: 16,
  },
  queueText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  queueBar: {
    height: 8,
    backgroundColor: '#003A7A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  queueProgress: {
    height: '100%',
    backgroundColor: '#FFD500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 12,
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notesCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD500',
  },
  notesText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  timeline: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#444',
    borderWidth: 3,
    borderColor: '#1A1A1A',
  },
  timelineDotCompleted: {
    backgroundColor: '#FFD500',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#444',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#FFD500',
  },
  timelineContent: {
    flex: 1,
  },
  timelineDescription: {
    fontSize: 15,
    color: '#999',
    marginBottom: 4,
  },
  timelineDescriptionCompleted: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
  },
  primaryButton: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#005BBB',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helpCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#005BBB',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#005BBB',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
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
