import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Implement actual authentication
    setTimeout(() => {
      navigation.navigate('Profile');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>IVYAR</Text>
        <Text style={styles.subtitle}>ЗЕМЛЯ ДЛЯ ГЕРОЇВ</Text>
      </View>

      {/* Ukrainian Flag Accent */}
      <View style={styles.flagAccent}>
        <View style={styles.blueBar} />
        <View style={styles.yellowBar} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Вітаємо, Побратиме!</Text>
        <Text style={styles.description}>
          Система справедливого розподілу землі для ветеранів України
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>НОМЕР ТЕЛЕФОНУ</Text>
          <TextInput
            style={styles.input}
            placeholder="+380 XX XXX XX XX"
            placeholderTextColor="#666"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading || phoneNumber.length < 10}
        >
          <Text style={styles.buttonText}>
            {loading ? 'ЗАВАНТАЖЕННЯ...' : 'УВІЙТИ'}
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 Ваші дані захищені blockchain технологією
          </Text>
          <Text style={styles.infoText}>
            ✅ Прозора система без корупції
          </Text>
          <Text style={styles.infoText}>
            🎖️ Пріоритет для бойових ветеранів
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Створено IVYAR LLC | Підтримка: World Bank, USAID, NATO DIANA
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
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD500',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#005BBB',
    fontWeight: 'bold',
    marginTop: 4,
  },
  flagAccent: {
    height: 8,
    flexDirection: 'row',
  },
  blueBar: {
    flex: 1,
    backgroundColor: '#005BBB',
  },
  yellowBar: {
    flex: 1,
    backgroundColor: '#FFD500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD500',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderWidth: 2,
    borderColor: '#005BBB',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#005BBB',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: '#2C2C2C',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD500',
    padding: 16,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
