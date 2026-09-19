import QtQuick

// Port of Background.tsx with color="dark" (as used on the weather home page).
Item {
    id: root
    anchors.fill: parent

    property real cornerRadius: 0

    // Night sky gradient: #022B4B -> #2C434B
    Rectangle {
        anchors.fill: parent
        radius: root.cornerRadius
        Behavior on radius { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0.0; color: "#022B4B" }
            GradientStop { position: 1.0; color: "#2C434B" }
        }
    }

    // Deterministic star field (seeded, same LCG as SkyTime/Background.tsx)
    Item {
        id: stars
        anchors.fill: parent
        opacity: 1.0 // nightBlend = 1 -> (1 - 0.4) / 0.6 = 1

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

    // Moon glow removed — no longer part of the background.
}
