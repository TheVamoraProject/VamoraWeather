import QtQuick
import QtQuick.Window

Item {
    id: root

    property string title: "Weather"
    property bool buttonsVisible: true
    property bool closeButtonVisible: true

    signal closeRequested()

    height: 68
    z: 20

    // Frameless window has no native titlebar to grab, so dragging the
    // toolbar itself moves the window (sits below the title/buttons in
    // z-order so it never steals their clicks).
    MouseArea {
        anchors.fill: parent
        onPressed: (mouse) => {
            if (Window.window) Window.window.startSystemMove();
        }
    }

    Text {
        anchors.left: parent.left
        anchors.leftMargin: 20
        anchors.verticalCenter: parent.verticalCenter
        anchors.verticalCenterOffset: -2
        text: root.title
        color: "#ffffff"
        font.pixelSize: 30
        font.weight: Font.DemiBold
    }

    Row {
        id: buttonRow
        anchors.right: parent.right
        anchors.rightMargin: 12
        anchors.verticalCenter: parent.verticalCenter
        spacing: 2

        // Add button
        Rectangle {
            id: addBtn
            visible: root.buttonsVisible
            width: 40; height: 40; radius: 20
            color: addArea.containsMouse ? (addArea.pressed ? "#33FFFFFF" : "#1AFFFFFF") : "transparent"
            Behavior on color { ColorAnimation { duration: 120 } }

            IconImage { anchors.centerIn: parent; name: "plus"; iconSize: 22 }

            MouseArea {
                id: addArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
            }
        }

        // More button
        Rectangle {
            id: moreBtn
            visible: root.buttonsVisible
            width: 40; height: 40; radius: 20
            color: moreArea.containsMouse ? (moreArea.pressed ? "#33FFFFFF" : "#1AFFFFFF") : "transparent"
            Behavior on color { ColorAnimation { duration: 120 } }

            IconImage { anchors.centerIn: parent; name: "more-vertical"; iconSize: 22 }

            MouseArea {
                id: moreArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: menu.visible = !menu.visible
            }
        }

        // Close button (rightmost — window chrome, always last)
        Rectangle {
            id: closeBtn
            visible: root.closeButtonVisible
            width: 40; height: 40; radius: 20
            color: closeArea.containsMouse ? (closeArea.pressed ? "#4DFF453A" : "#26FF453A") : "transparent"
            Behavior on color { ColorAnimation { duration: 120 } }

            IconImage { anchors.centerIn: parent; name: "x"; iconSize: 20 }

            MouseArea {
                id: closeArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.closeRequested()
            }
        }
    }

    // Click-outside catcher
    MouseArea {
        anchors.fill: parent
        z: 25
        visible: menu.visible
        onClicked: menu.visible = false
    }

    Rectangle {
        id: menu
        visible: false
        z: 30
        width: 160
        radius: 12
        color: "#CC000000"
        border.color: "#1AFFFFFF"
        border.width: 1
        anchors.top: buttonRow.bottom
        anchors.right: parent.right
        anchors.rightMargin: 12
        anchors.topMargin: -4
        height: menuCol.implicitHeight

        Column {
            id: menuCol
            width: parent.width

            Repeater {
                model: ["Donate", "Feedback", "Help", "Manage Locations"]
                Rectangle {
                    width: menuCol.width
                    height: 38
                    color: itemArea.containsMouse ? "#1AFFFFFF" : "transparent"
                    Behavior on color { ColorAnimation { duration: 100 } }

                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 16
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData
                        color: "#ffffff"
                        font.pixelSize: 14
                    }

                    MouseArea {
                        id: itemArea
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: menu.visible = false
                    }
                }
            }
        }
    }
}
