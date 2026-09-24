import QtQuick

Flickable {
    id: root
    anchors.fill: parent
    contentWidth: width
    contentHeight: content.height + content.y + 96
    boundsBehavior: Flickable.DragAndOvershootBounds
    clip: true

    property bool forecastExpanded: false
    property var service

    readonly property var hourly: service ? service.hourly : []
    readonly property var forecast: service ? service.daily : []

    readonly property var conditionStats: service ? [
        { label: "Feels like", value: service.toTemp(service.feelsLikeC) + "\u00B0", icon: "gauge" },
        { label: "Humidity",   value: service.humidity + "%",                          icon: "droplets" },
        { label: "Wind",       value: service.windKmh + " km/h",                       icon: "wind" },
        { label: "Visibility", value: service.visibilityKm + " km",                   icon: "eye" }
    ] : []

    readonly property var visibleDays: forecastExpanded ? forecast : forecast.slice(0, 3)

    Column {
        id: content
        width: Math.min(480, root.width - 32)
        anchors.horizontalCenter: parent.horizontalCenter
        y: 84 + 12
        spacing: 14

        Column {
            width: parent.width
            topPadding: 40
            bottomPadding: 90
            spacing: 0

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: service ? service.cityName : "—"
                color: "#F2FFFFFF"
                font.pixelSize: 22
                font.weight: Font.DemiBold
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: service ? service.country : ""
                color: "#7AFFFFFF"
                font.pixelSize: 14
                topPadding: 2
            }

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: 10
                spacing: 0

                Text {
                    text: service ? service.toTemp(service.tempC) : "—"
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
                text: service ? service.conditionLabel : "—"
                color: "#99FFFFFF"
                font.pixelSize: 15
                topPadding: 2
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: service ? ("H: " + service.toTemp(service.todayHigh) + "\u00B0   \u00B7   L: " + service.toTemp(service.todayLow) + "\u00B0") : ""
                color: "#61FFFFFF"
                font.pixelSize: 13
                topPadding: 4
            }
        }

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
                                        text: service ? service.toTemp(modelData.temp) : "—"
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
                                    text: service ? (service.toTemp(modelData.low) + "\u00B0") : ""
                                    color: "#52FFFFFF"
                                    font.pixelSize: 15
                                }
                                Text {
                                    text: service ? (service.toTemp(modelData.high) + "\u00B0") : ""
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

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            visible: service && service.loading && service.hourly.length === 0
            text: "Loading weather…"
            color: "#7AFFFFFF"
            font.pixelSize: 14
        }

        GlassCard {
            width: parent.width
            visible: service && service.error !== ""

            Column {
                x: 18; y: 16
                width: parent.width - 36
                bottomPadding: 16
                spacing: 10

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: service ? service.error : ""
                    color: "#FF9D8A"
                    font.pixelSize: 14
                }
                Text {
                    text: "Tap to retry"
                    color: "#B3FFFFFF"
                    font.pixelSize: 14
                    font.weight: Font.Medium
                }
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: service.refresh()
            }
        }

        Item {
            width: parent.width
            height: 24
            visible: service && service.updatedTime !== ""

            Text {
                anchors.centerIn: parent
                text: service ? ("Updated " + service.updatedTime + "  ·  tap to refresh") : ""
                color: refreshArea.containsMouse ? "#B3FFFFFF" : "#52FFFFFF"
                font.pixelSize: 12
                Behavior on color { ColorAnimation { duration: 150 } }
            }

            MouseArea {
                id: refreshArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: service.refresh()
            }
        }
    }
}
