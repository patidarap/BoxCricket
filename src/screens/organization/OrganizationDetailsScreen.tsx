import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { Text } from '../../components/common/Text';
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { Container } from '../../components/common/Container';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import { PlayersTab } from './PlayersTab';
import { ScoresTab } from './ScoresTab';
import { PaymentsTab } from './PaymentsTab';

const Tab = createMaterialTopTabNavigator();

export const OrganizationDetailsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentOrganization = useSelector(
    (state: RootState) => state.organization.currentOrganization,
  );

  if (!currentOrganization) {
    return (
      <Container center>
        <Text>Organization not found</Text>
      </Container>
    );
  }

  console.warn('Current Organization:', currentOrganization);

  const isAdmin = currentOrganization?.createdBy === user?.id;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingTop: 50 }}>
        <ScreenHeader
          title={currentOrganization.name}
          leftIcon={<Text style={{ fontSize: 24 }}>←</Text>}
          onLeftPress={() => navigation.goBack()}
          // rightIcon={
          //   isAdmin ? (
          //     <View
          //       style={[
          //         styles.adminBadge,
          //         {
          //           backgroundColor: theme.colors.primary + '20',
          //           borderRadius: theme.borderRadius.sm,
          //         },
          //       ]}
          //     >
          //       <Text
          //         variant="caption"
          //         style={{ color: theme.colors.primary, fontWeight: '600' }}
          //       >
          //         ADMIN
          //       </Text>
          //     </View>
          //   ) : undefined
          // }
        />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
          },
        }}
      >
        <Tab.Screen name="Players" component={PlayersTab} />
        <Tab.Screen name="Scores">
          {() => <ScoresTab navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Payments" component={PaymentsTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  adminBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
