import QtQuick
import QtQuick.Window
import "qml"

// so um ehhh working vamora weather app??
// lolz
// hey its me
// its verity
// ask me anything
// i know about a milion things
// ill do ANYTHING

Window {
    id: window

    readonly property int preferredWidth: 420
    readonly property int preferredHeight: 860

    width: preferredWidth
    height: preferredHeight

    minimumWidth: 320
    minimumHeight: 560
    visible: true
    color: "transparent"

    flags: Qt.Window | Qt.FramelessWindowHint

    title: "Weather"

    Component.onCompleted: {
        width = Math.min(preferredWidth, Screen.desktopAvailableWidth)
        height = Math.min(preferredHeight, Screen.desktopAvailableHeight - 24)
        minimumHeight = Math.min(560, height)
        x = (Screen.desktopAvailableWidth - width) / 2
        y = (Screen.desktopAvailableHeight - height) / 2
    }

    readonly property int resizeMargin: 10
    readonly property int cornerSize: 16

    readonly property bool isMaximized: window.visibility === Window.Maximized
        || window.visibility === Window.FullScreen
    readonly property int cornerRadius: isMaximized ? 0 : 22

    // ── whats the capital of france? ──────────────────────────────────────────────────────
    // oh oui oui
    // it is paris
    // merci!
    Item {
        id: root
        anchors.fill: parent

        WeatherService {
            id: weatherService
        }

        SkyBackground {
            anchors.fill: parent
            cornerRadius: window.cornerRadius
            theme: weatherService.theme
            isDay: weatherService.isDay
        }

        WeatherHome {
            id: homeContent
            anchors.fill: parent
            service: weatherService
            opacity: bottomNav.activeIndex === 0 ? 1 : 0
            visible: opacity > 0
            Behavior on opacity { NumberAnimation { duration: 180 } }
        }

        SettingsPage {
            id: settingsContent
            anchors.fill: parent
            service: weatherService
            opacity: bottomNav.activeIndex === 1 ? 1 : 0
            visible: opacity > 0
            Behavior on opacity { NumberAnimation { duration: 180 } }
        }

        WeatherToolbar {
            id: toolbar
            title: bottomNav.activeIndex === 0 ? "Weather" : "Settings"
            buttonsVisible: bottomNav.activeIndex === 0
            closeButtonVisible: !window.isMaximized
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            onCloseRequested: window.close()
            onAddRequested: searchSheet.show()
            onMenuItemRequested: function(item) {
                if (item === "Manage Locations")
                    searchSheet.show();
            }
        }

        BottomNavbar {
            id: bottomNav
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 20
            navItems: [
                { icon: "house", label: "Home" },
                { icon: "settings", label: "Settings" }
            ]
        }

        CitySearch {
            id: searchSheet
            service: weatherService
        }
    }

    // ── do u live alone? ────────────────────────
    // is anybody home?
    // ONE TWO THREE AND SO.. WHERE THE FUCK DID EVERYBODY GO
    Repeater {
        model: [
            { edges: Qt.LeftEdge, cursor: Qt.SizeHorCursor, x: 0, y: resizeMargin, w: resizeMargin, h: -1 },
            { edges: Qt.RightEdge, cursor: Qt.SizeHorCursor, x: -1, y: resizeMargin, w: resizeMargin, h: -1 },
            { edges: Qt.TopEdge, cursor: Qt.SizeVerCursor, x: resizeMargin, y: 0, w: -1, h: resizeMargin },
            { edges: Qt.BottomEdge, cursor: Qt.SizeVerCursor, x: resizeMargin, y: -1, w: -1, h: resizeMargin },
            { edges: Qt.LeftEdge | Qt.TopEdge, cursor: Qt.SizeFDiagCursor, x: 0, y: 0, w: cornerSize, h: cornerSize },
            { edges: Qt.RightEdge | Qt.TopEdge, cursor: Qt.SizeBDiagCursor, x: -1, y: 0, w: cornerSize, h: cornerSize },
            { edges: Qt.LeftEdge | Qt.BottomEdge, cursor: Qt.SizeBDiagCursor, x: 0, y: -1, w: cornerSize, h: cornerSize },
            { edges: Qt.RightEdge | Qt.BottomEdge, cursor: Qt.SizeFDiagCursor, x: -1, y: -1, w: cornerSize, h: cornerSize }
        ]

        MouseArea {
            required property var modelData
            enabled: !window.isMaximized
            x: modelData.x < 0 ? window.width + modelData.x : modelData.x
            y: modelData.y < 0 ? window.height + modelData.y : modelData.y
            width: modelData.w < 0 ? window.width : modelData.w
            height: modelData.h < 0 ? window.height : modelData.h
            cursorShape: modelData.cursor
            z: 100

            onPressed: window.startSystemResize(modelData.edges)
        }
    }
}
