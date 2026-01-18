import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface LandParcel {
  id: string;
  cadastralNumber: string;
  oblast: string;
  area: string;
  marketValue: string;
  status: string;
  soilQuality?: string;
  coordinates?: { lat: number; lng: number };
}

export default function LandParcelsScreen({ navigation }: any) {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterOblast, setFilterOblast] = useState('');
  const [filterStatus, setFilterStatus] = useState('AVAILABLE');

  const fetchParcels = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (filterOblast) params.append('oblast', filterOblast);
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await fetch(
        `https://ivyar-ddr-module.vercel.app/api/land/parcels?${params.toString()}`
      );
      const data = await response.json();
      
      if (data.success) {
        setParcels(data.data);
      }
    } catch (error) {
      console.error('Error fetching parcels:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [filterOblast, filterStatus]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchParcels();
  };

  const formatCurrency = (value: string) => {
    return `₴${Number(value).toLocaleString('uk-UA')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← НАЗАД</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ДОСТУПНІ ДІЛЯНКИ</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>ОБЛАСТЬ</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filterOblast}
                onValueChange={setFilterOblast}
                style={styles.picker}
                dropdownIconColor="#FFD500"
              >
                <Picker.Item label="Всі області" value="" />
                <Picker.Item label="Чернігівська" value="Chernihiv" />
                <Picker.Item label="Житомирська" value="Zhytomyr" />
                <Picker.Item label="Київська" value="Kyiv" />
                <Picker.Item label="Полтавська" value="Poltava" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>СТАТУС</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filterStatus}
                onValueChange={setFilterStatus}
                style={styles.picker}
                dropdownIconColor="#FFD500"
              >
                <Picker.Item label="Доступні" value="AVAILABLE" />
                <Picker.Item label="Зарезервовані" value="RESERVED" />
                <Picker.Item label="Виділені" value="ALLOCATED" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            📍 {parcels.length} {parcels.length === 1 ? 'ділянка' : 'ділянок'}
          </Text>
          <Text style={styles.statsText}>
            📊 {parcels.reduce((sum, p) => sum + Number(p.area), 0).toFixed(1)} га
          </Text>
        </View>
      </View>

      {/* Parcels List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD500" />
          <Text style={styles.loadingText}>Завантаження ділянок...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.parcelsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FFD500"
            />
          }
        >
          {parcels.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗺️</Text>
              <Text style={styles.emptyTitle}>Немає ділянок</Text>
              <Text style={styles.emptyText}>
                Спробуйте змінити фільтри або оновіть список
              </Text>
            </View>
          ) : (
            parcels.map((parcel) => (
              <TouchableOpacity
                key={parcel.id}
                style={styles.parcelCard}
                onPress={() => {
                  // Navigate to parcel details or map view
                }}
              >
                {/* Header */}
                <View style={styles.parcelHeader}>
                  <View style={styles.cadastralBadge}>
                    <Text style={styles.cadastralText}>
                      {parcel.cadastralNumber}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      parcel.status === 'AVAILABLE' && styles.statusAvailable,
                      parcel.status === 'RESERVED' && styles.statusReserved,
                      parcel.status === 'ALLOCATED' && styles.statusAllocated,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {parcel.status === 'AVAILABLE' && '✓ ДОСТУПНА'}
                      {parcel.status === 'RESERVED' && '⏳ РЕЗЕРВ'}
                      {parcel.status === 'ALLOCATED' && '🔒 ВИДІЛЕНА'}
                    </Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.parcelDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📍 Область:</Text>
                    <Text style={styles.detailValue}>{parcel.oblast}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📏 Площа:</Text>
                    <Text style={styles.detailValue}>{parcel.area} га</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💰 Вартість:</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(parcel.marketValue)}
                    </Text>
                  </View>

                  {parcel.soilQuality && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🌱 Ґрунт:</Text>
                      <Text style={styles.detailValue}>{parcel.soilQuality}</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                {parcel.status === 'AVAILABLE' && (
                  <TouchableOpacity
                    style={styles.interestButton}
                    onPress={() => {
                      // Mark interest or navigate to application
                      navigation.navigate('Apply');
                    }}
                  >
                    <Text style={styles.interestButtonText}>
                      ⭐ ЗАЦІКАВЛЕНИЙ
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}

          <View style={styles.spacer} />
        </ScrollView>
      )}

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoFooterText}>
          🔄 Оновлюється щодня | 🔐 Blockchain гарантує точність
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
  filtersContainer: {
    padding: 20,
    backgroundColor: '#2C2C2C',
    borderBottomWidth: 1,
    borderBottomColor: '#005BBB',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 8,
    letterSpacing: 1,
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#005BBB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 44,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Courier New',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  parcelsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  parcelCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#005BBB',
  },
  parcelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cadastralBadge: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 8,
    borderRadius: 4,
  },
  cadastralText: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: '#FFD500',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusAvailable: {
    backgroundColor: '#005BBB',
  },
  statusReserved: {
    backgroundColor: '#666',
  },
  statusAllocated: {
    backgroundColor: '#444',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  parcelDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  interestButton: {
    backgroundColor: '#005BBB',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  interestButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  spacer: {
    height: 40,
  },
  infoFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  infoFooterText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
