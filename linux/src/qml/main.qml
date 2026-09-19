import QtQuick
import QtQuick.Window
import "qml"

// VamoraOS port of VamiWeather's home screen (design only, no live data).
//
// Window chrome: no native titlebar / min-max-close buttons, but the window
// remains resizable — edges use QWindow.startSystemResize() so the
// compositor (Wayland/X11) handles the actual resize the same way it would
// for a decorated window.
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

    // Fit + center once at startup only. Binding these live to width/height
    // would re-run this formula on every resize frame — including drags
    // from the left/top edge, where width legitimately changes — and snap
    // the window back to center mid-drag.
    Component.onCompleted: {
        width = Math.min(preferredWidth, Screen.desktopAvailableWidth)
        height = Math.min(preferredHeight, Screen.desktopAvailableHeight - 24)
        minimumHeight = Math.min(560, height)
        x = (Screen.desktopAvailableWidth - width) / 2
        y = (Screen.desktopAvailableHeight - height) / 2
    }

    readonly property int resizeMargin: 10
    readonly property int cornerSize: 16

    // True whenever the compositor/WM/user has maximized (or fullscreened)
    // the window — regardless of who triggered it. On VamoraOS mobile this
    // is the forced layout: square corners, no close button (window chrome
    // is handled by the shell instead).
    readonly property bool isMaximized: window.visibility === Window.Maximized
        || window.visibility === Window.FullScreen
    readonly property int cornerRadius: isMaximized ? 0 : 22

    // ── content ──────────────────────────────────────────────────────
    // Rounding is done by SkyBackground's own rectangle (the only thing
    // that paints corner-to-corner); everything on top of it — cards,
    // toolbar, navbar pill — is already inset or already rounded, so no
    // extra masking module is needed to get the rounded-window look.
    Item {
        id: root
        anchors.fill: parent

        SkyBackground {
            anchors.fill: parent
            cornerRadius: window.cornerRadius
        }

        WeatherHome {
            id: homeContent
            anchors.fill: parent
            opacity: bottomNav.activeIndex === 0 ? 1 : 0
            visible: opacity > 0
            Behavior on opacity { NumberAnimation { duration: 180 } }
        }

        SettingsPage {
            id: settingsContent
            anchors.fill: parent
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
    }

    // ── invisible edge/corner resize handles ────────────────────────
    // (frameless windows lose native resize borders, so we restore them
    // via the compositor's own resize grab — no custom dragging math)
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
