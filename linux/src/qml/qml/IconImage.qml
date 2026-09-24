import QtQuick

// i miss that kind of misery
// the kind where you are nice to me
// but only in the evening
// so i ask am i just dreaming (OK IM SO SORRY LMAOOO)
Item {
    id: root

    property string name: "sun"      // matches icons/<white|gray>/<name>.svg
    property int iconSize: 20
    property string tint: "white"    // "white" | "gray"

    implicitWidth: iconSize
    implicitHeight: iconSize

    Image {
        anchors.fill: parent
        source: "../icons/" + root.tint + "/" + root.name + ".svg"
        sourceSize.width: root.iconSize * 2
        sourceSize.height: root.iconSize * 2
        fillMode: Image.PreserveAspectFit
        smooth: true
    }
}
