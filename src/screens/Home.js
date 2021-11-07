import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  DrawerLayout,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Divider,
  FAB,
  IconButton,
  Menu,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

import AddFirstPassword from '../components/AddFirstPassword';
import PasswordCard from '../components/PasswordCard';
import ScreenTitle from '../components/ScreenTitle';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';
import DeletePasswordButton from '../components/DeletePasswordButton';
import {ThemeContext} from '../context/theme';
import LogoutFAB from '../components/LogoutFAB';

let PASSWORD_LIST;
const Home = props => {
  const styles = useStyles();
  const authCtx = useContext(AuthContext);
  const themectx = useContext(ThemeContext);

  // Search Ref
  const searchRef = useRef(null);

  // Swipeable refs
  let row = [];
  let prevOpenedRow;

  // DrawerLayout ref
  const drawerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noSearchResult, setNoSearchResult] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection(authCtx.user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        result => {
          const passwordData = result.docs.map(snapshot => {
            const id = snapshot.id;
            const data = snapshot.data();
            return {...data, id};
          });
          PASSWORD_LIST = passwordData;
          setPasswords(passwordData);
          setLoading(false);
        },
        error => {
          crashlytics().recordError(error, 'Error getting password');
          setLoading(false);
        },
      );
    return () => {
      subscriber();
    };
  }, []);

  const onChangeSearch = query => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setPasswords(PASSWORD_LIST);
      setNoSearchResult(false);
      return;
    }

    const searchedPassword = PASSWORD_LIST.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (searchedPassword.length === 0) {
      setPasswords(PASSWORD_LIST);
      setNoSearchResult(true);
    } else {
      setPasswords(searchedPassword);
      setNoSearchResult(false);
    }
  };

  function handleOpenPassword(password) {
    props.navigation.navigate('Details', password);
  }

  function closeRow(index) {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  }

  function closeDeleted(index) {
    row[index].close();
  }

  function openMenu() {
    searchRef.current.blur();
    drawerRef.current.openDrawer();
  }

  function menuNavigation(screen) {
    drawerRef.current.closeDrawer();
    props.navigation.navigate(screen);
  }

  const renderDrawer = () => {
    return (
      <View style={styles.menuContainer}>
        <Text style={styles.menuHead}>*****</Text>
        <Divider />
        <Menu.Item
          title="Profile"
          icon="account"
          onPress={() => menuNavigation('Profile')}
        />
        <Menu.Item
          title="Settings"
          icon="cog"
          onPress={() => menuNavigation('Settings')}
        />
        <Divider />
        <Menu.Item
          title="Theme"
          icon={themectx.dark ? 'weather-night' : 'white-balance-sunny'}
          onPress={() => themectx.change()}
        />
        <Divider />
        <LogoutFAB />
      </View>
    );
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={50} />
      <Text style={{fontSize: normalize(20)}}>Loading passwords ...</Text>
    </View>
  ) : (
    <DrawerLayout
      ref={drawerRef}
      keyboardDismissMode="on-drag"
      drawerWidth={normalize(190)}
      drawerPosition={DrawerLayout.positions.Right}
      renderNavigationView={renderDrawer}>
      <View style={styles.container}>
        {passwords.length === 0 && (
          <>
            <View style={styles.head}>
              <ScreenTitle title="Passwords" size={26} />
              <IconButton
                icon="menu"
                size={32}
                onPress={() => drawerRef.current.openDrawer()}
              />
            </View>
            <AddFirstPassword
              onAddPress={() => props.navigation.navigate('PasswordForm')}
            />
          </>
        )}

        {passwords.length !== 0 && (
          <>
            <View style={styles.head}>
              <ScreenTitle
                title={`${
                  passwords.length > 99 ? '99+' : passwords.length
                } Passwords`}
                size={26}
              />
              <IconButton icon="menu" size={32} onPress={openMenu} />
            </View>
            <Searchbar
              blurOnSubmit
              ref={searchRef}
              value={searchQuery}
              placeholder="Search"
              onChangeText={onChangeSearch}
            />

            {noSearchResult && (
              <Text style={styles.noSearchResult}>
                No search result found, showing all
              </Text>
            )}

            <View style={{flex: 1, marginTop: normalize(10)}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={passwords}
                extraData={passwords}
                keyExtractor={(item, index) => index.toString()}
                refreshing={false}
                renderItem={({item, index}) => {
                  return (
                    <Swipeable
                      ref={ref => (row[index] = ref)}
                      friction={1}
                      onSwipeableOpen={() => closeRow(index)}
                      renderRightActions={() => (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <DeletePasswordButton
                            size={25}
                            id={item.id}
                            onDelete={() => closeDeleted(index)}
                          />
                        </View>
                      )}>
                      <PasswordCard
                        password={item}
                        onPress={handleOpenPassword}
                      />
                    </Swipeable>
                  );
                }}
              />
              <View style={styles.passowrdCountView}>
                {passwords.length > 99 && (
                  <Text style={styles.countText}>
                    You have {passwords.length} passwords saved.
                  </Text>
                )}
              </View>
            </View>
          </>
        )}

        {passwords.length !== 0 && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => props.navigation.navigate('PasswordForm')}
          />
        )}
      </View>
    </DrawerLayout>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    menuContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    menuHead: {
      fontSize: normalize(36),
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.primary,
    },
    head: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalize(8),
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: normalize(15),
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: normalize(15),
      paddingBottom: 0,
      backgroundColor: theme.colors.background,
    },
    noSearchResult: {
      marginTop: normalize(10),
      marginHorizontal: normalize(35),
    },
    passowrdCountView: {
      height: normalize(25),
      justifyContent: 'center',
      margin: normalize(8),
    },
    countText: {color: theme.colors.disabled},
    fab: {
      margin: normalize(16),
      right: 0,
      bottom: 0,
      position: 'absolute',
    },
  });
};

export default gestureHandlerRootHOC(Home);
