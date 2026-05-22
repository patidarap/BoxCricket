import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { FAB } from '../../components/buttons/FAB';
import { BottomSheet } from '../../components/modals/BottomSheet';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import {
  addPayment,
  updatePaymentStatus,
} from '../../store/slices/organizationSlice';
import { generateId } from '../../utils/helpers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getPaymentStatusColor } from '../../utils/helpers';
import { organizationService } from '../../api/organizationService';
import { Avatar } from '../../components/common/Avatar';
import {
  showSuccessMessage,
  showDangerMessage,
} from '../../utils/flashMessage';
import { useNavigation } from '@react-navigation/native';

export const PaymentsTab = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [splits, setSplits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentOrganization = useSelector(
    (state: RootState) => state.organization.currentOrganization,
  );
  const payments = useSelector(
    (state: RootState) => state.organization.payments,
  );

  const isAdmin = currentOrganization?.createdBy === user?.id;
  const orgPayments = payments.filter(
    p => p.organizationId === currentOrganization?.id,
  );

  useEffect(() => {
    if (currentOrganization && showAddModal) {
      fetchMembers();
    }
  }, [currentOrganization, showAddModal]);

  useEffect(() => {
    if (currentOrganization) {
      fetchSplits();
    }
  }, [currentOrganization]);

  const fetchMembers = async () => {
    if (!currentOrganization) return;

    try {
      const response = await organizationService.getMembers(
        currentOrganization._id || currentOrganization.id,
      );

      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchSplits = async () => {
    if (!currentOrganization) return;

    try {
      const response = await organizationService.getSplits(
        currentOrganization._id || currentOrganization.id,
      );

      console.warn('getSplits response:', response);

      if (response.success && response.data) {
        setSplits(response.data.splits || []);
      }
    } catch (error: any) {
      console.error('Error fetching splits:', error);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAllMembers = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(m => m.userId?._id || m._id));
    }
  };

  const splitAmount =
    selectedMembers.length > 0
      ? (parseFloat(amount) / selectedMembers.length).toFixed(2)
      : '0.00';

  const handleAddPayment = async () => {
    if (!amount.trim() || selectedMembers.length === 0 || !currentOrganization)
      return;

    setLoading(true);
    try {
      const response = await organizationService.createSplit({
        organizationId: currentOrganization._id || currentOrganization.id,
        title: description.trim() || 'Payment',
        amount: parseFloat(amount),
        upiId: upiId.trim(),
        mobileNumber: mobileNumber.trim(),
        members: selectedMembers,
      });

      if (response.success) {
        showSuccessMessage('Payment request sent successfully');
        setAmount('');
        setDescription('');
        setUpiId('');
        setMobileNumber('');
        setSelectedMembers([]);
        setShowAddModal(false);
        fetchSplits();
      } else {
        showDangerMessage(response.message || 'Failed to create payment');
      }
    } catch (error: any) {
      showDangerMessage(error.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (
    paymentId: string,
    newStatus: 'paid' | 'pending' | 'partial',
  ) => {
    dispatch(updatePaymentStatus({ paymentId, status: newStatus }));
  };

  const handleMarkPaid = async (splitMemberId: string) => {
    console.warn('splitMemberId:', splitMemberId);

    try {
      const response = await organizationService.markPaid(splitMemberId);
      console.warn('Mark Paid Response:', response);

      if (response.success) {
        showSuccessMessage('Payment marked as paid');
        fetchSplits();
      } else {
        showDangerMessage(response.message || 'Failed to mark as paid');
      }
    } catch (error: any) {
      showDangerMessage(error.message || 'Failed to mark as paid');
    }
  };

  const renderPayment = ({ item }: any) => {
    const isCreator = item.createdBy?._id === user?.id;
    const doneCount =
      item.members?.filter((m: any) => m.status === 'done').length || 0;
    const totalCount = item.members?.length || 0;

    // Find current user's splitMemberId
    const currentUserMember = item.members?.find(
      (m: any) => m.user?._id === user?.id,
    );
    const splitMemberId = currentUserMember?.splitMemberId;
    const currentUserStatus = currentUserMember?.status;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'PaymentDetails' as never,
            { payment: item } as never,
          )
        }
        style={[
          styles.paymentCard,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
          },
        ]}
      >
        <View style={styles.paymentHeader}>
          <Avatar name={item.createdBy?.name || 'User'} size="md" />
          <View style={styles.paymentHeaderText}>
            <Text variant="bodyMedium">
              {item.createdBy?.name || 'Unknown'}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Requested for '{item.title || 'Payment'}'
            </Text>
          </View>
        </View>

        <View style={styles.paymentAmount}>
          <Text variant="h4" color={theme.colors.text}>
            {formatCurrency(item.amount)}
          </Text>
        </View>

        <View style={styles.paymentProgress}>
          <View style={styles.avatarGroup}>
            {item.members?.slice(0, 3).map((member: any, index: number) => (
              <Avatar
                key={index}
                name={member.user?.name || 'User'}
                size="sm"
                style={styles.avatarOverlap}
              />
            ))}
          </View>
          <Text variant="bodySmall" color={theme.colors.textSecondary}>
            {doneCount}/{totalCount} paid
          </Text>
        </View>

        <View style={styles.paymentStatus}>
          <View style={styles.statusLeft}>
            <Text style={{ fontSize: 16 }}>⏱</Text>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>
              Unpaid • {formatDate(item.createdAt)}
            </Text>
          </View>
          <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
            →
          </Text>
        </View>

        {!isCreator && splitMemberId && (
          <PrimaryButton
            title={
              currentUserStatus === 'done'
                ? 'Payment Done '
                : currentUserStatus === 'paid'
                ? 'Waiting For Approval'
                : 'Paid'
            }
            onPress={() => handleMarkPaid(splitMemberId)}
            style={[
              styles.payButton,
              currentUserStatus === 'paid' && styles.waitingButton,
              currentUserStatus === 'done' && styles.doneButton,
            ]}
            disabled={
              currentUserStatus === 'paid' || currentUserStatus === 'done'
            }
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {splits.length > 0 ? (
        <FlatList
          data={splits}
          keyExtractor={item => item._id || item.id}
          renderItem={renderPayment}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48 }}>💰</Text>
          <Spacer size="md" />
          <Text variant="body" color={theme.colors.textSecondary} center>
            No payments yet
          </Text>
          {isAdmin && (
            <Text variant="bodySmall" color={theme.colors.textSecondary} center>
              Add payments to track expenses
            </Text>
          )}
        </View>
      )}

      {isAdmin && (
        <View style={styles.fabContainer}>
          <FAB onPress={() => setShowAddModal(true)} />
        </View>
      )}

      <BottomSheet
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Split Payment"
      >
        <ScrollView>
          <Text variant="bodySmall" color={theme.colors.textSecondary} center>
            Please enter your amount
          </Text>
          <Spacer size="sm" />

          <View style={styles.amountSection}>
            <Text style={[styles.rupeeSymbol, { color: theme.colors.text }]}>
              ₹
            </Text>
            <TextInput
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.amountInput, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholder}
              autoFocus
            />
          </View>

          <Spacer size="md" />

          <Input
            placeholder="What's this for?"
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
          />

          <Input
            placeholder="Please enter UPI ID here"
            value={upiId}
            onChangeText={setUpiId}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Spacer size="md" />

          <View style={styles.splitSection}>
            <Text variant="h6">Split evenly</Text>
            <Spacer size="md" />

            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={selectAllMembers}
            >
              <Text variant="bodySmall" color={theme.colors.primary}>
                {selectedMembers.length === members.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Text>
            </TouchableOpacity>

            {members.map(member => {
              const memberId = member.userId?._id || member._id;
              const isSelected = selectedMembers.includes(memberId);
              const memberSplitAmount =
                isSelected && selectedMembers.length > 0 && amount
                  ? (parseFloat(amount) / selectedMembers.length).toFixed(2)
                  : '0';

              return (
                <TouchableOpacity
                  key={memberId}
                  style={styles.memberRow}
                  onPress={() => toggleMemberSelection(memberId)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : 'transparent',
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        ✓
                      </Text>
                    )}
                  </View>
                  <Avatar name={member.userId?.name || 'User'} size="md" />
                  <View style={styles.memberInfo}>
                    <Text variant="bodyMedium">
                      {member.userId?.name || 'Unknown'}
                    </Text>
                  </View>
                  <Text variant="bodyMedium" color={theme.colors.text}>
                    ₹{memberSplitAmount}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Spacer size="xl" />

          <PrimaryButton
            title="Send request"
            onPress={handleAddPayment}
            disabled={!amount.trim() || selectedMembers.length === 0 || loading}
            loading={loading}
          />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  paymentCard: {
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentAmount: {
    marginBottom: 16,
  },
  paymentProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButton: {
    backgroundColor: '#1976D2',
  },
  waitingButton: {
    backgroundColor: '#757575',
  },
  doneButton: {
    backgroundColor: '#10B981',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  rupeeSymbol: {
    fontSize: 30,
    paddingVertical: 20,
    marginRight: 4,
    marginTop: 10,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '600',
    minWidth: 120,
    padding: 0,
  },
  descriptionInput: {
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  splitSection: {
    marginTop: 16,
  },
  selectAllButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
});
