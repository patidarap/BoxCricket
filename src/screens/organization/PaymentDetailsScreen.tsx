import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Avatar } from '../../components/common/Avatar';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { organizationService } from '../../api/organizationService';
import {
  showSuccessMessage,
  showDangerMessage,
} from '../../utils/flashMessage';

export const PaymentDetailsScreen = ({ route, navigation }: any) => {
  const { payment } = route?.params;
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentOrganization = useSelector(
    (state: RootState) => state.organization.currentOrganization,
  );
  const [splitData, setSplitData] = useState(payment);
  const [members, setMembers] = useState(payment.members || []);

  const isAdmin = currentOrganization?.createdBy === user?.id;

  useFocusEffect(
    React.useCallback(() => {
      fetchSplitDetails();
    }, []),
  );

  const fetchSplitDetails = async () => {
    try {
      const response = await organizationService.getSplitById(payment?._id);
      console.warn('Split details by id :', response?.data);

      if (response.success && response.data) {
        setSplitData(response.data);
        setMembers(response.data.members || []);
      }
    } catch (error: any) {
      console.error('Error fetching split details:', error);
    }
  };

  const paidMembers =
    members?.filter((m: any) => m.status === 'done').length || 0;
  const totalMembers = members?.length || 0;
  const paidAmount = paidMembers * splitData.perPersonAmount;
  const leftAmount = splitData.amount - paidAmount;
  const progressPercentage = (paidAmount / splitData.amount) * 100;

  const handleVerifyPayment = async (
    splitMemberId: string,
    status: 'done' | 'pending',
  ) => {
    try {
      const response = await organizationService.verifyPayment(
        splitMemberId,
        status,
      );
      if (response.success) {
        showSuccessMessage(
          status === 'done' ? 'Payment approved' : 'Payment cancelled',
        );
        fetchSplitDetails();
      } else {
        showDangerMessage(response.message || 'Failed to verify payment');
      }
    } catch (error: any) {
      showDangerMessage(error.message || 'Failed to verify payment');
    }
  };

  const renderMember = ({ item }: any) => {
    const isCurrentUser = item.user?._id === user?.id;
    const status = item.status;

    const getStatusText = () => {
      if (status === 'paid') return 'Paid';
      if (status === 'done') return 'Done';
      return 'Pending';
    };

    const getStatusColor = () => {
      if (status === 'paid') return '#FF9800';
      if (status === 'done') return '#4CAF50';
      return '#666';
    };

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberLeft}>
          <View>
            <Avatar name={item.user?.name || 'User'} size="md" />
            {status === 'done' && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.memberInfo}>
            <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
              {isCurrentUser ? 'You' : item.user?.name || 'Unknown'}
            </Text>
            <Text variant="body" color={getStatusColor()}>
              {getStatusText()}
            </Text>
          </View>
        </View>
        <View style={styles.memberRight}>
          <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
            {formatCurrency(item.payAmount)}
          </Text>
          {isAdmin && status === 'paid' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleVerifyPayment(item.splitMemberId, 'done')}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() =>
                  handleVerifyPayment(item.splitMemberId, 'pending')
                }
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text variant="h6" style={{ flex: 1, textAlign: 'center' }}>
          {payment?.title}
        </Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={[styles.menuIcon, { color: theme.colors.text }]}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.totalSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Avatar name={splitData.createdBy?.name || 'User'} size="md" />
          <Spacer size="md" />
          <Text variant="h4" style={{ fontWeight: '600' }}>
            Total: {formatCurrency(splitData.amount)}
          </Text>
          <Spacer size="lg" />

          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Spacer size="sm" />

          <View style={styles.progressLabels}>
            <Text variant="body" color="#666">
              {formatCurrency(paidAmount)} paid
            </Text>
            <Text variant="body" color="#666">
              {formatCurrency(leftAmount)} left
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View
          style={[
            styles.membersSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.membersHeader}>
            <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
              {paidMembers} of {totalMembers} paid
            </Text>
          </View>

          <Spacer size="md" />

          <FlatList
            data={members || []}
            keyExtractor={(item, index) =>
              item.splitMemberId || index.toString()
            }
            renderItem={renderMember}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  totalSection: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  progressBar: {
    width: '85%',
    height: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  divider: {
    height: 8,
  },
  membersSection: {
    padding: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberRight: {
    alignItems: 'flex-end',
  },
  memberInfo: {
    marginLeft: 12,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
