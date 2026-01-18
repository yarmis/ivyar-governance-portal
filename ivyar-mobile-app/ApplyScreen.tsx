import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OBLASTS = [
  'Чернігівська',
  'Житомирська',
  'Київська',
  'Полтавська',
  'Вінницька',
  'Черкаська',
  'Кіровоградська',
];

const LAND_USE_TYPES = [
  { value: 'AGRICULTURAL', label: 'Сільськогосподарське' },
  { value: 'RESIDENTIAL', label: 'Житлове' },
  { value: 'MIXED', label: 'Змішане' },
];

export default function ApplyScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    preferredOblast: '',
    preferredAreaMin: '',
    preferredAreaMax: '',
    preferredLandUse: 'AGRICULTURAL',
    additionalInfo: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.preferredOblast) {
      Alert.alert('Помилка', 'Оберіть область');
      return;
    }

    if (!formData.preferredAreaMin || !formData.preferredAreaMax) {
      Alert.alert('Помилка', 'Вкажіть бажану площу');
      return;
    }

    setSubmitting(true);

    // TODO: API call to submit application
    try {
      // const response = await fetch('https://ivyar-ddr-module.vercel.app/api/land/veteran-grants/apply', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setTimeout(() => {
        Alert.alert(
          'Заявка подана!',
          'Ваша заявка успішно подана. Ми розглянемо її протягом 1-3 місяців. Ви отримаєте сповіщення про рішення.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setSubmitting(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося подати заявку. Спробуйте пізніше.');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← НАЗАД</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ЗАЯВКА НА ЗЕМЛЮ</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 ЯК ЦЕ ПРАЦЮЄ</Text>
          <Text style={styles.infoText}>
            1. Ви вказуєте ваші побажання щодо землі{'\n'}
            2. Система розраховує ваш пріоритет{'\n'}
            3. Ми підбираємо підходящі ділянки{'\n'}
            4. Розподіл через чесну лотерею{'\n'}
            5. Blockchain гарантує прозорість
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          
          {/* Oblast Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>БАЖАНА ОБЛАСТЬ *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.preferredOblast}
                onValueChange={(value) => setFormData({...formData, preferredOblast: value})}
                style={styles.picker}
                dropdownIconColor="#FFD500"
              >
                <Picker.Item label="Оберіть область..." value="" />
                {OBLASTS.map(oblast => (
                  <Picker.Item key={oblast} label={oblast} value={oblast} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Area Range */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>БАЖАНА ПЛОЩА (ГЕКТАРІВ) *</Text>
            <View style={styles.rangeRow}>
              <View style={styles.rangeInput}>
                <Text style={styles.rangeLabel}>Від</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor="#666"
                  value={formData.preferredAreaMin}
                  onChangeText={(value) => setFormData({...formData, preferredAreaMin: value})}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.rangeSeparator}>—</Text>
              <View style={styles.rangeInput}>
                <Text style={styles.rangeLabel}>До</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor="#666"
                  value={formData.preferredAreaMax}
                  onChangeText={(value) => setFormData({...formData, preferredAreaMax: value})}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          {/* Land Use Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>ТИП ЗЕМЛЕКОРИСТУВАННЯ *</Text>
            {LAND_USE_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.radioOption,
                  formData.preferredLandUse === type.value && styles.radioOptionSelected
                ]}
                onPress={() => setFormData({...formData, preferredLandUse: type.value})}
              >
                <View style={[
                  styles.radio,
                  formData.preferredLandUse === type.value && styles.radioSelected
                ]} />
                <Text style={[
                  styles.radioLabel,
                  formData.preferredLandUse === type.value && styles.radioLabelSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Info */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>ДОДАТКОВА ІНФОРМАЦІЯ (необов'язково)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Наприклад: досвід в сільському господарстві, плани розвитку..."
              placeholderTextColor="#666"
              value={formData.additionalInfo}
              onChangeText={(value) => setFormData({...formData, additionalInfo: value})}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Priority Preview */}
          <View style={styles.priorityPreview}>
            <Text style={styles.priorityTitle}>ВАШ ПРІОРИТЕТ</Text>
            <Text style={styles.priorityScore}>245 БАЛІВ</Text>
            <Text style={styles.priorityLevel}>БОЙОВИЙ ВЕТЕРАН</Text>
            <Text style={styles.priorityEstimate}>Очікуваний час: 1-3 місяці</Text>
          </View>

          {/* Terms */}
          <View style={styles.termsBox}>
            <Text style={styles.termsTitle}>📜 УМОВИ ОТРИМАННЯ ЗЕМЛІ</Text>
            <Text style={styles.termsText}>
              • Обробляти землю протягом 5 років{'\n'}
              • Не продавати протягом 10 років{'\n'}
              • Не здавати в оренду агрохолдингам{'\n'}
              • Всі угоди записані в blockchain
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'ВІДПРАВЛЕННЯ...' : 'ПОДАТИ ЗАЯВКУ'}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.spacer} />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoBox: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 12,
    letterSpacing: 1,
  },
  pickerContainer: {
    backgroundColor: '#2C2C2C',
    borderWidth: 2,
    borderColor: '#005BBB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  rangeSeparator: {
    fontSize: 24,
    color: '#666',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderWidth: 2,
    borderColor: '#005BBB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  radioOptionSelected: {
    borderColor: '#005BBB',
    backgroundColor: '#1A3A52',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#FFD500',
    backgroundColor: '#FFD500',
  },
  radioLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  radioLabelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  priorityPreview: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#005BBB',
  },
  priorityTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  priorityScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD500',
  },
  priorityLevel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  priorityEstimate: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  termsBox: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD500',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  spacer: {
    height: 40,
  },
});
