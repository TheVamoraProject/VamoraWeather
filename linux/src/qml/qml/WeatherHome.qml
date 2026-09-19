import QtQuick

Flickable {
    id: root
    anchors.fill: parent
    contentWidth: width
    contentHeight: content.height + content.y + 32
    boundsBehavior: Flickable.DragAndOvershootBounds
    clip: true

    property bool forecastExpanded: false

    readonly property var hourly: [
        { time: "Now",   temp: 17, icon: "cloud" },
        { time: "14:00", temp: 17, icon: "cloud-sun" },
        { time: "15:00", temp: 18, icon: "sun" },
        { time: "16:00", temp: 18, icon: "sun" },
        { time: "17:00", temp: 17, icon: "cloud-sun" },
        { time: "18:00", temp: 15, icon: "cloud" },
        { time: "19:00", temp: 14, icon: "cloud-rain" },
        { time: "20:00", temp: 13, icon: "moon" },
        { time: "21:00", temp: 12, icon: "moon" }
    ]

    readonly property var forecast: [
        { day: "Today", high: 18, low: 11, icon: "cloud",      label: "Cloudy" },
        { day: "Tue",   high: 19, low: 12, icon: "cloud-sun",  label: "Partly cloudy" },
        { day: "Wed",   high: 16, low: 10, icon: "cloud-rain", label: "Showers" },
        { day: "Thu",   high: 14, low: 9,  icon: "cloud-rain", label: "Rain" },
        { day: "Fri",   high: 17, low: 11, icon: "cloud-sun",  label: "Partly cloudy" }
    ]

    readonly property var conditionStats: [
        { label: "Feels like", value: "15\u00B0", icon: "gauge" },
        { label: "Humidity",   value: "72%",       icon: "droplets" },
        { label: "Wind",       value: "18 km/h",   icon: "wind" },
        { label: "Visibility", value: "9 km",      icon: "eye" }
    ]

    readonly property var visibleDays: forecastExpanded ? forecast : forecast.slice(0, 3)

    Column {
        id: content
        width: Math.min(480, root.width - 32)
        anchors.horizontalCenter: parent.horizontalCenter
        y: 72 + 8
        spacing: 14

        // ══ Hero ═══════════════════════════════════════════════
        Column {
            width: parent.width
            topPadding: 40
            bottomPadding: 90
            spacing: 0

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "London"
                color: "#F2FFFFFF"
                font.pixelSize: 22
                font.weight: Font.DemiBold
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "United Kingdom"
                color: "#7AFFFFFF"
                font.pixelSize: 14
                topPadding: 2
            }

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: 10
                spacing: 0

                Text {
                    text: "17"
                    color: "#F2FFFFFF"
                    font.pixelSize: 96
                    font.weight: Font.Bold
                    font.letterSpacing: -4
                }
                Text {
                    text: "\u00B0"
                    color: "#BFFFFFFF"
                    font.pixelSize: 52
                    font.weight: Font.Bold
                    anchors.top: parent.top
                    anchors.topMargin: 8
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Sunny"
                color: "#99FFFFFF"
                font.pixelSize: 15
                topPadding: 2
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "H: 19\u00B0   \u00B7   L: 11\u00B0"
                color: "#61FFFFFF"
                font.pixelSize: 13
                topPadding: 4
            }
        }

        // ══ Hourly forecast ════════════════════════════════════
        GlassCard {
            width: parent.width

            Column {
                x: 18; y: 16
                width: parent.width - 36
                bottomPadding: 16
                spacing: 14

                Text {
                    text: "HOURLY"
                    color: "#59FFFFFF"
                    font.pixelSize: 11
                    font.weight: Font.DemiBold
                    font.letterSpacing: 0.9
                }

                Flickable {
                    width: parent.width
                    height: 74
                    contentWidth: hourlyRow.implicitWidth
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds

                    Row {
                        id: hourlyRow
                        spacing: 22

                        Repeater {
                            model: root.hourly
                            Column {
                                spacing: 8
                                width: 30

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: modelData.time
                                    color: "#6BFFFFFF"
                                    font.pixelSize: 12
                                }
                                IconImage {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    name: modelData.icon
                                    iconSize: 20
                                    opacity: 0.88
                                }
                                Row {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    Text {
                                        text: modelData.temp
                                        color: "#EBFFFFFF"
                                        font.pixelSize: 14
                                        font.weight: Font.Medium
                                    }
                                    Text {
                                        text: "\u00B0"
                                        color: "#EBFFFFFF"
                                        font.pixelSize: 11
                                        anchors.top: parent.top
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ══ Forecast card ══════════════════════════════════════
        GlassCard {
            id: forecastCard
            width: parent.width

            Column {
                width: parent.width
                spacing: 0

                Text {
                    x: 18; topPadding: 16; bottomPadding: 8
                    text: "FORECAST"
                    color: "#59FFFFFF"
                    font.pixelSize: 11
                    font.weight: Font.DemiBold
                    font.letterSpacing: 0.9
                }

                Repeater {
                    model: root.visibleDays
                    Item {
                        width: forecastCard.width
                        height: 48

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 18
                            anchors.rightMargin: 18
                            spacing: 12

                            Text {
                                width: 48
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.day
                                color: "#E0FFFFFF"
                                font.pixelSize: 15
                                font.weight: index === 0 ? Font.DemiBold : Font.Normal
                            }

                            Row {
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 7
                                width: parent.width - 48 - 90 - 24

                                IconImage {
                                    anchors.verticalCenter: parent.verticalCenter
                                    name: modelData.icon
                                    iconSize: 17
                                    opacity: 0.6
                                }
                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.label
                                    color: "#6BFFFFFF"
                                    font.pixelSize: 13
                                }
                            }

                            Row {
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 10
                                width: 90
                                layoutDirection: Qt.RightToLeft

                                Text {
                                    text: modelData.low + "\u00B0"
                                    color: "#52FFFFFF"
                                    font.pixelSize: 15
                                }
                                Text {
                                    text: modelData.high + "\u00B0"
                                    color: "#E0FFFFFF"
                                    font.pixelSize: 15
                                    font.weight: Font.Medium
                                }
                            }
                        }

                        Rectangle {
                            visible: index < root.visibleDays.length - 1
                            anchors.left: parent.left
                            anchors.leftMargin: 18
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 1
                            color: "#14FFFFFF"
                        }
                    }
                }

                // divider above the toggle button
                Rectangle {
                    width: parent.width
                    height: 1
                    color: "#14FFFFFF"
                }

                Item {
                    width: parent.width
                    height: 42

                    Row {
                        anchors.centerIn: parent
                        spacing: 6

                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: root.forecastExpanded ? "Show less" : "5-day forecast"
                            color: toggleArea.containsMouse ? "#B3FFFFFF" : "#6BFFFFFF"
                            font.pixelSize: 13
                            font.weight: Font.Medium
                            Behavior on color { ColorAnimation { duration: 150 } }
                        }
                        IconImage {
                            anchors.verticalCenter: parent.verticalCenter
                            name: "chevron-down"
                            iconSize: 14
                            opacity: toggleArea.containsMouse ? 0.7 : 0.42
                            rotation: root.forecastExpanded ? 180 : 0
                            Behavior on rotation { NumberAnimation { duration: 250; easing.type: Easing.OutCubic } }
                            Behavior on opacity { NumberAnimation { duration: 150 } }
                        }
                    }

                    MouseArea {
                        id: toggleArea
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.forecastExpanded = !root.forecastExpanded
                    }
                }
            }
        }

        // ══ Condition stat cards ═══════════════════════════════
        Grid {
            width: parent.width
            columns: 2
            columnSpacing: 12
            rowSpacing: 12

            Repeater {
                model: root.conditionStats
                GlassCard {
                    width: (content.width - 12) / 2

                    Column {
                        x: 18; y: 16
                        width: parent.width - 36
                        bottomPadding: 16
                        spacing: 12

                        Row {
                            spacing: 7
                            IconImage {
                                anchors.verticalCenter: parent.verticalCenter
                                name: modelData.icon
                                iconSize: 14
                                opacity: 0.38
                            }
                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.label.toUpperCase()
                                color: "#61FFFFFF"
                                font.pixelSize: 12
                                font.weight: Font.Medium
                                font.letterSpacing: 0.3
                            }
                        }

                        Text {
                            text: modelData.value
                            color: "#EBFFFFFF"
                            font.pixelSize: 26
                            font.weight: Font.Light
                            font.letterSpacing: -0.5
                        }
                    }
                }
            }
        }
    }
}
