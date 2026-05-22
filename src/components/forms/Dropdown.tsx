import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import {Text} from '../common/Text';
import {Spacer} from '../common/Spacer';
import {Avatar} from '../common/Avatar';
import {useTheme} from '../../hooks/useTheme';

interface DropdownOption {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  options,
  value,
  onSelect,
  error,
}) => {
  const {theme} = useTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    onSelect(id);
    setVisible(false);
    setSearch('');
  };

  return (
    <View style={styles.container}>
      {label && (
        <>
          <Text variant="bodySmall" color={theme.colors.textSecondary}>
            {label}
          </Text>
          <Spacer size="xs" />
        </>
      )}
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.md,
          },
        ]}
        onPress={() => setVisible(true)}>
        {selectedOption ? (
          <View style={styles.selectedItem}>
            <Avatar name={selectedOption.name} size="sm" />
            <View style={styles.selectedInfo}>
              <Text variant="body">{selectedOption.name}</Text>
              {selectedOption.email && (
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {selectedOption.email}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text variant="body" color={theme.colors.textSecondary}>
            {placeholder}
          </Text>
        )}
        <Text style={{fontSize: 20, color: theme.colors.textSecondary}}>
          ▼
        </Text>
      </TouchableOpacity>
      {error && (
        <>
          <Spacer size="xs" />
          <Text variant="caption" color={theme.colors.error}>
            {error}
          </Text>
        </>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.lg,
              },
            ]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text variant="h5">{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={{fontSize: 24, color: theme.colors.textSecondary}}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            <Spacer size="md" />

            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
              placeholder="Search..."
              placeholderTextColor={theme.colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />

            <Spacer size="md" />

            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        value === item.id
                          ? theme.colors.primary + '20'
                          : 'transparent',
                      borderRadius: theme.borderRadius.md,
                    },
                  ]}
                  onPress={() => handleSelect(item.id)}>
                  <Avatar name={item.name} size="md" />
                  <View style={styles.optionInfo}>
                    <Text variant="bodyMedium">{item.name}</Text>
                    {item.email && (
                      <Text variant="caption" color={theme.colors.textSecondary}>
                        {item.email}
                      </Text>
                    )}
                  </View>
                  {value === item.id && (
                    <Text style={{fontSize: 20, color: theme.colors.primary}}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text variant="body" color={theme.colors.textSecondary} center>
                    No players found
                  </Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    padding: 12,
    fontSize: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  optionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
});
