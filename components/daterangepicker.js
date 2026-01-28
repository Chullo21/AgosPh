import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateRangePicker({ onUpdate }) {
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const handleFromChange = (event, selectedDate) => {
    setShowFrom(false);
    if (selectedDate) {
      setFrom(selectedDate);
      if (onUpdate) onUpdate('from', selectedDate);
    }
  };

  const handleToChange = (event, selectedDate) => {
    setShowTo(false);
    if (selectedDate) {
      setTo(selectedDate);
      // FIXED: changed 'from' to 'to'
      if (onUpdate) onUpdate('to', selectedDate);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButton} onPress={() => setShowFrom(true)}>
          <Text style={styles.labelText}>From</Text>
          {/* FIXED: Convert Date object to String */}
          <Text style={styles.buttonText}>{from.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customButton} onPress={() => setShowTo(true)}>
          <Text style={styles.labelText}>To</Text>
          {/* FIXED: Convert Date object to String */}
          <Text style={styles.buttonText}>{to.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showFrom && (
        <DateTimePicker 
          value={from} 
          display="spinner" 
          mode="date" 
          onChange={handleFromChange} 
          maximumDate={to} // Cannot pick start date after end date
        />
      )}

      {showTo && (
        <DateTimePicker 
          value={to} 
          display="spinner" 
          mode="date" 
          onChange={handleToChange} 
          minimumDate={from} // Cannot pick end date before start date
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    justifyContent: "center",
  },
  labelText: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
  },
  buttonText: {
    color: "#00a3e5",
    fontWeight: "bold",
    fontSize: 14,
  },
  customButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00a3e5",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});