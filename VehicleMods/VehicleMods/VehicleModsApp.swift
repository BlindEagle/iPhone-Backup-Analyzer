import SwiftUI
import SwiftData

@main
struct VehicleModsApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [Vehicle.self, Modification.self, EngineBlueprint.self])
    }
}
