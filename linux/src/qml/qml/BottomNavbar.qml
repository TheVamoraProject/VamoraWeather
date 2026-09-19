import QtQuick

Item {
    id: root

    property var navItems: [
        { icon: "house", label: "Home" },
        { icon: "settings", label: "Settings" }
    ]
    property int activeIndex: 0

    readonly property int itemWidth: 60
    readonly property int itemSpacing: 4

    width: row.implicitWidth + 10
    height: 48

    Rectangle {
        anchors.fill: parent
        radius: height / 2
        color: "#66181818"          // dark:bg-zinc-900/40 approximation
        border.color: "#1AFFFFFF"   // dark:border-white/10
        border.width: 1
    }

    // sliding indicator pill — computed directly (every nav item shares
    // the same fixed width), so it's correct from the very first frame
    // instead of depending on Repeater delegates already existing.
    Rectangle {
        id: indicator
        y: 6
        height: parent.height - 12
        radius: height / 2
        color: "#26FFFFFF"  // dark:bg-white/15
        x: row.x + root.activeIndex * (root.itemWidth + root.itemSpacing)
        width: root.itemWidth

        Behavior on x { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        Behavior on width { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
    }

    Row {
        id: row
        anchors.centerIn: parent
        spacing: root.itemSpacing

        Repeater {
            id: itemRepeater
            model: root.navItems

            Item {
                id: navBtn
                width: root.itemWidth
                height: 40
                property bool isActive: index === root.activeIndex

                IconImage {
                    anchors.centerIn: parent
                    name: modelData.icon
                    iconSize: 19
                    tint: navBtn.isActive ? "white" : "gray"
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.activeIndex = index
                }
            }
        }
    }
}
