import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Share,
} from 'react-native';

interface AllocatedLand {
  grantId: string;
  cadastralNumber: string;
  oblast: string;
  area: string;
  marketValue: string;
  allocationDate: string;
  blockchainTxHash: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  conditions: {
    cultivationYears: number;
    noSaleYears: number;
    noLeaseToCorporations: boolean;
  };
  soilQuality: string;
  nearestCity: string;
}

export default function MyLandScreen({ navigation }: any) {
  const [land, setLand] = useState<AllocatedLand | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLand({
        grantId: 'VLG-2026-00123',
        cadastralNumber: 'UA-CHE-2024-00001',
        oblast: 'Чернігівська',
        area: '8.5',
        marketValue: '4250000',
        allocationDate: '2026-03-15',
        blockchainTxHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
        coordinates: {
          lat: 51.4982,
          lng: 31.2893,
        },
        conditions: {
          cultivationYears: 5,
          noSaleYears: 10,
          noLeaseToCorporations: true,
        },
        soilQuality: 'Чорнозем, клас I',
        nearestCity: 'Чернігів (12 км)',
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleViewOnMap = () => {
    if (land) {
      // Open map application or navigate to map screen
      Alert.alert(
        'Відкрити карту',
        `Координати: ${land.coordinates.lat}, ${land.coordinates.lng}`,
        [
          { text: 'Скасувати', style: 'cancel' },
          { text: 'Google Maps', onPress: () => {} },
        ]
      );
    }
  };

  const handleViewBlockchain = () => {
    if (land) {
      Alert.alert(
        'Blockchain Certificate',
        `Transaction: ${land.blockchainTxHash}\n\nВідкрити в PolygonScan?`,
        [
          { text: 'Скасувати', style: 'cancel' },
          { 
            text: 'Відкрити', 
            onPress: () => {
              // Open browser to polygonscan
            } 
          },
        ]
      );
    }
  };

  const handleShareCertificate = async () => {
    try {
      await Share.share({
        message: `🏡 МОЯ ЗЕМЛЯ\n\n` +
          `Кадастровий номер: ${land?.cadastralNumber}\n` +
          `Область: ${land?.oblast}\n` +
          `Площа: ${land?.area} га\n` +
          `Виділено: ${land?.allocationDate}\n\n` +
          `🔐 Blockchain TX: ${land?.blockchainTxHash}\n\n` +
          `✊ Земля належить героям, а не олігархам!\n` +
          `Слава Україні! 🇺🇦`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatCurrency = (value: string) => {
    return `₴${Number(value).toLocaleString('uk-UA')}`;
  };

  const formatDate = (dateString: string) => {
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

  if (!land) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyIcon}>🗺️</Text>
        <Text style={styles.emptyTitle}>Земля ще не виділена</Text>
        <Text style={styles.emptyText}>
          Ваша заявка розглядається. Як тільки земля буде виділена, ви побачите її тут.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>ПОВЕРНУТИСЬ</Text>
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
        <Text style={styles.headerTitle}>МОЯ ЗЕМЛЯ</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Celebration Banner */}
        <View style={styles.celebrationBanner}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.celebrationText}>
            ВІТАЄМО! ВИ ОТРИМАЛИ ЗЕМЛЮ!
          </Text>
        </View>

        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.cadastralHeader}>
            <Text style={styles.cadastralLabel}>КАДАСТРОВИЙ НОМЕР</Text>
            <Text style={styles.cadastralNumber}>{land.cadastralNumber}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{land.area}</Text>
              <Text style={styles.statLabel}>гектарів</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{formatCurrency(land.marketValue)}</Text>
              <Text style={styles.statLabel}>вартість</Text>
            </View>
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 РОЗТАШУВАННЯ</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Область:</Text>
              <Text style={styles.detailValue}>{land.oblast}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Найближче місто:</Text>
              <Text style={styles.detailValue}>{land.nearestCity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Координати:</Text>
              <Text style={styles.detailValueMono}>
                {land.coordinates.lat.toFixed(4)}, {land.coordinates.lng.toFixed(4)}
              </Text>
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={handleViewOnMap}>
              <Text style={styles.mapButtonText}>🗺️ ВІДКРИТИ НА КАРТІ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Land Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌱 ХАРАКТЕРИСТИКИ</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ґрунт:</Text>
              <Text style={styles.detailValue}>{land.soilQuality}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Дата виділення:</Text>
              <Text style={styles.detailValue}>{formatDate(land.allocationDate)}</Text>
            </View>
          </View>
        </View>

        {/* Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 УМОВИ ВОЛОДІННЯ</Text>
          <View style={styles.conditionsCard}>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionIcon}>✓</Text>
              <Text style={styles.conditionText}>
                Обробляти землю протягом {land.conditions.cultivationYears} років
              </Text>
            </View>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionIcon}>✓</Text>
              <Text style={styles.conditionText}>
                Не продавати протягом {land.conditions.noSaleYears} років
              </Text>
            </View>
            {land.conditions.noLeaseToCorporations && (
              <View style={styles.conditionItem}>
                <Text style={styles.conditionIcon}>✓</Text>
                <Text style={styles.conditionText}>
                  Не здавати в оренду агрохолдингам
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Blockchain Certificate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 BLOCKCHAIN СЕРТИФІКАТ</Text>
          <View style={styles.blockchainCard}>
            <Text style={styles.blockchainLabel}>TRANSACTION HASH</Text>
            <Text style={styles.blockchainHash}>{land.blockchainTxHash}</Text>
            <Text style={styles.blockchainInfo}>
              Ваше право власності записане в blockchain і не може бути змінене або підроблене
            </Text>
            <TouchableOpacity
              style={styles.blockchainButton}
              onPress={handleViewBlockchain}
            >
              <Text style={styles.blockchainButtonText}>ПЕРЕВІРИТИ В BLOCKCHAIN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShareCertificate}>
          <Text style={styles.shareButtonText}>📤 ПОДІЛИТИСЬ СЕРТИФІКАТОМ</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🇺🇦 Земля героям, а не олігархам | IVYAR 2026
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
  celebrationBanner: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  celebrationIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  celebrationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD500',
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD500',
  },
  cadastralHeader: {
    marginBottom: 20,
  },
  cadastralLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
    letterSpacing: 1,
  },
  cadastralNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD500',
    fontFamily: 'Courier New',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
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
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  detailValueMono: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#FFFFFF',
  },
  mapButton: {
    backgroundColor: '#005BBB',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  conditionsCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  conditionIcon: {
    fontSize: 20,
    color: '#FFD500',
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  blockchainCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#005BBB',
  },
  blockchainLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    letterSpacing: 1,
  },
  blockchainHash: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#FFD500',
    marginBottom: 16,
  },
  blockchainInfo: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  blockchainButton: {
    backgroundColor: '#005BBB',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  blockchainButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shareButton: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD500',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD500',
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
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
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
