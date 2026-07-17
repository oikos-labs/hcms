import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Stack, Tabs, useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrayerIcon } from "@/components/navigation/PrayerIcon";
import { useMainTabHistory } from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const HEADING = "#031A17";
const NEUTRAL_GRAY = "#3A4D4B";
const BORDER_DEFAULT = "rgba(3, 26, 23, 0.1)";
const ICON_SIZE = 22;
const TAB_BAR_HEIGHT = 60;
const BACK_BUTTON_SIZE = 44;
const BACK_BUTTON_INSET = (TAB_BAR_HEIGHT - BACK_BUTTON_SIZE) / 2;
const BACK_BUTTON_RESERVED_WIDTH = BACK_BUTTON_SIZE + BACK_BUTTON_INSET * 2;

function DiaryTabs() {
  const mainTabsNavigation = useNavigation("/(main)");
  const insets = useSafeAreaInsets();
  const { getPreviousMainTab } = useMainTabHistory();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: HEADING,
        tabBarInactiveTintColor: HEADING,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => (
          <Pressable
            accessibilityLargeContentTitle={
              props.accessibilityLargeContentTitle
            }
            accessibilityShowsLargeContentViewer={
              props.accessibilityShowsLargeContentViewer
            }
            aria-label={props["aria-label"]}
            aria-selected={props["aria-selected"]}
            android_ripple={props.android_ripple}
            disabled={props.disabled}
            onLongPress={props.onLongPress}
            onPress={(event) => props.onPress?.(event)}
            role={props.role}
            style={({ pressed }) => [
              props.style,
              {
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              },
              pressed && { opacity: 0.7 },
            ]}
            testID={props.testID}
          >
            {props.children}
          </Pressable>
        ),
        tabBarLabelStyle: {
          fontFamily: "Pretendard",
          fontSize: 11,
          fontWeight: "500",
          includeFontPadding: false,
          lineHeight: 13,
        },
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          height: ICON_SIZE,
          marginBottom: 2,
          width: ICON_SIZE,
        },
        tabBarStyle: {
          bottom: Math.max(insets.bottom, 16),
          height: TAB_BAR_HEIGHT,
          width: "95%",
          marginHorizontal: "2.5%",
          paddingBottom: 0,
          paddingTop: 0,
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderRadius: 999,
          borderWidth: 1,
          borderColor: BORDER_DEFAULT,
          elevation: 8,
          shadowColor: HEADING,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.14,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="back_action"
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            mainTabsNavigation.navigate(getPreviousMainTab() as never);
          },
        }}
        options={{
          tabBarAccessibilityLabel: "메인 탭으로 돌아가기",
          tabBarButton: (props) => (
            <Pressable
              accessibilityLargeContentTitle={
                props.accessibilityLargeContentTitle
              }
              accessibilityShowsLargeContentViewer={
                props.accessibilityShowsLargeContentViewer
              }
              aria-label={props["aria-label"]}
              aria-selected={props["aria-selected"]}
              android_ripple={props.android_ripple}
              disabled={props.disabled}
              onLongPress={props.onLongPress}
              onPress={(event) => props.onPress?.(event)}
              role={props.role}
              style={({ pressed }) => [
                props.style,
                {
                  alignItems: "center",
                  flex: 0,
                  height: BACK_BUTTON_SIZE,
                  justifyContent: "center",
                  padding: 0,
                  width: BACK_BUTTON_SIZE,
                },
                pressed && { opacity: 0.7 },
              ]}
              testID={props.testID}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIconStyle: {
            height: ICON_SIZE,
            marginBottom: 0,
            width: ICON_SIZE,
          },
          tabBarIcon: () => (
            <Ionicons
              color={NEUTRAL_GRAY}
              name="arrow-back-outline"
              size={ICON_SIZE}
            />
          ),
          tabBarItemStyle: {
            alignItems: "center",
            backgroundColor: "rgba(3, 26, 23, 0.05)",
            borderRadius: BACK_BUTTON_SIZE / 2,
            height: BACK_BUTTON_SIZE,
            justifyContent: "center",
            left: BACK_BUTTON_INSET,
            position: "absolute",
            top: BACK_BUTTON_INSET,
            width: BACK_BUTTON_SIZE,
            zIndex: 1,
          },
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "일기",
          tabBarItemStyle: {
            marginLeft: BACK_BUTTON_RESERVED_WIDTH,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "book" : "book-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "일기",
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          tabBarAccessibilityLabel: "검토",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "file-tray-full" : "file-tray-full-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "검토",
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarAccessibilityLabel: "기도",
          tabBarIcon: ({ color, focused }) => (
            <PrayerIcon color={color} focused={focused} size={ICON_SIZE} />
          ),
          title: "기도",
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          tabBarAccessibilityLabel: "선교",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? "earth" : "earth-outline"}
              size={ICON_SIZE}
            />
          ),
          title: "선교",
        }}
      />
    </Tabs>
  );
}

function DiaryStack() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="back_action" />
      <Stack.Screen name="index" />
      <Stack.Screen name="review" />
      <Stack.Screen name="prayer" />
      <Stack.Screen name="mission" />
    </Stack>
  );
}

export default function DiaryLayout() {
  const { usesSidebar } = useResponsiveLayout();

  return usesSidebar ? <DiaryStack /> : <DiaryTabs />;
}
