import QtQuick

// Port of Background.tsx: `theme` mirrors its `color` prop — "Dark" forces
// the night sky, "Light" forces the day sky, "Auto" follows real day/night
// (isDay from the weather data), like Background without a color override.
Item {
    id: root
    anchors.fill: parent

    property real cornerRadius: 0
    property string theme: "Auto"   // "Auto" | "Dark" | "Light"
    property bool isDay: false

    readonly property bool night: theme === "Dark" ? true : theme === "Light" ? false : !isDay

    // Night sky gradient: #022B4B -> #2C434B; day: #0066AE -> #84C5DD.
    Rectangle {
        anchors.fill: parent
        radius: root.cornerRadius
        Behavior on radius { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0.0; color: root.night ? "#022B4B" : "#0066AE" }
            GradientStop { position: 1.0; color: root.night ? "#2C434B" : "#84C5DD" }
        }
    }

    // Deterministic star field (seeded, same LCG as SkyTime/Background.tsx)
    Item {
        id: stars
        anchors.fill: parent
        opacity: root.night ? 1.0 : 0.0 // nightBlend = 1 -> (1 - 0.4) / 0.6 = 1
        Behavior on opacity { NumberAnimation { duration: 600 } }

        Repeater {
            model: 60

            Rectangle {
                id: star
                readonly property real r0: {
                    var seed = 42;
                    for (var i = 0; i < index * 4; i++) seed = (seed * 9301 + 49297) % 233280;
                    return seed;
                }
                function nextRand(s) { return (s * 9301 + 49297) % 233280; }

                readonly property real s1: nextRand(r0)
                readonly property real s2: nextRand(s1)
                readonly property real s3: nextRand(s2)
                readonly property real s4: nextRand(s3)

                readonly property real topPct: (s1 / 233280) * 70
                readonly property real leftPct: (s2 / 233280) * 100
                readonly property int starSize: (s3 / 233280) < 0.85 ? 1 : 2

                width: starSize
                height: starSize
                radius: starSize / 2
                color: "#ffffff"
                opacity: 0.6
                x: parent.width * (leftPct / 100)
                y: parent.height * (topPct / 100)

                SequentialAnimation on opacity {
                    loops: Animation.Infinite
                    running: true
                    NumberAnimation { from: 0.2; to: 0.6; duration: 1500; easing.type: Easing.InOutQuad }
                    NumberAnimation { from: 0.6; to: 0.2; duration: 1500; easing.type: Easing.InOutQuad }
                }
            }
        }
    }

    // THEY CALL ME LORD VERITY
}
