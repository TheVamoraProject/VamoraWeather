import QtQuick

Flickable {
    id: root
    anchors.fill: parent
    contentWidth: width
    contentHeight: content.height + content.y + 32
    boundsBehavior: Flickable.DragAndOvershootBounds
    clip: true

    property var service

    readonly property var preferences: service ? [
        { icon: "gauge", label: "Units", value: service.tempUnit === "°C" ? "Celsius" : "Fahrenheit" },
        { icon: "cloud", label: "Notifications", value: service.notificationsEnabled ? "On" : "Off" },
        { icon: "eye", label: "Location services", value: service.cityName !== "" ? service.cityName : "Auto" }
    ] : []

    readonly property var about: service ? [
        { icon: "moon", label: "Appearance", value: service.theme },
        { icon: "settings", label: "About VamoraOS", value: "1.0.0" }
    ] : []

    Column {
        id: content
        width: Math.min(480, root.width - 32)
        anchors.horizontalCenter: parent.horizontalCenter
        y: 84 + 12
        spacing: 14

        Text {
            x: 4
            text: "SETTINGS"
            color: "#59FFFFFF"
            font.pixelSize: 11
            font.weight: Font.DemiBold
            font.letterSpacing: 0.9
        }

        // ══ Preferences card ═══════════════════════════════════
        GlassCard {
            id: prefsCard
            width: parent.width

            Column {
                width: parent.width
                spacing: 0

                Repeater {
                    model: root.preferences
                    Item {
                        width: prefsCard.width
                        height: 52

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 18
                            anchors.rightMargin: 18
                            spacing: 12

                            IconImage {
                                anchors.verticalCenter: parent.verticalCenter
                                name: modelData.icon
                                iconSize: 17
                                opacity: 0.6
                            }
                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.label
                                color: "#E0FFFFFF"
                                font.pixelSize: 15
                                width: parent.width - 17 - 90 - 24
                            }
                            Row {
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 8
                                width: 90
                                layoutDirection: Qt.RightToLeft

                                IconImage {
                                    anchors.verticalCenter: parent.verticalCenter
                                    name: "chevron-down"
                                    iconSize: 14
                                    rotation: -90
                                    opacity: 0.42
                                }
                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.value
                                    color: "#6BFFFFFF"
                                    font.pixelSize: 14
                                }
                            }
                        }

                        Rectangle {
                            visible: index < root.preferences.length - 1
                            anchors.left: parent.left
                            anchors.leftMargin: 18
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 1
                            color: "#14FFFFFF"
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                if (!root.service)
                                    return;
                                if (index === 0)
                                    root.service.toggleTempUnit();
                                else if (index === 1)
                                    root.service.toggleNotifications();
                                else if (index === 2)
                                    root.service.detectLocation();
                            }
                        }
                    }
                }
            }
        }

        // ══ About card ═══════════════════════════════════════════
        GlassCard {
            id: aboutCard
            width: parent.width

            Column {
                width: parent.width
                spacing: 0

                Repeater {
                    model: root.about
                    Item {
                        width: aboutCard.width
                        height: 52

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 18
                            anchors.rightMargin: 18
                            spacing: 12

                            IconImage {
                                anchors.verticalCenter: parent.verticalCenter
                                name: modelData.icon
                                iconSize: 17
                                opacity: 0.6
                            }
                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.label
                                color: "#E0FFFFFF"
                                font.pixelSize: 15
                                width: parent.width - 17 - 90 - 24
                            }
                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.value
                                color: "#6BFFFFFF"
                                font.pixelSize: 14
                                width: 90
                                horizontalAlignment: Text.AlignRight
                            }
                        }

                        Rectangle {
                            visible: index < root.about.length - 1
                            anchors.left: parent.left
                            anchors.leftMargin: 18
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 1
                            color: "#14FFFFFF"
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                if (root.service && index === 0)
                                    root.service.cycleTheme();
                            }
                        }
                    }
                }
            }
        }
    }
}
