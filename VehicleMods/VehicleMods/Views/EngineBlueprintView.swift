import SwiftUI

struct EngineBlueprintView: View {
    @Bindable var vehicle: Vehicle
    @Bindable var blueprint: EngineBlueprint
    @State private var isEditing = false

    var body: some View {
        List {
            // Power Summary Card
            Section {
                HStack(spacing: 0) {
                    PowerTile(value: blueprint.horsepowerAtWheel > 0 ? "\(Int(blueprint.horsepowerAtWheel))" : "--",
                              sub: "WHP", color: .orange)
                    Divider()
                    PowerTile(value: blueprint.horsepowerAtCrank > 0 ? "\(Int(blueprint.horsepowerAtCrank))" : "--",
                              sub: "BHP", color: .red)
                    Divider()
                    PowerTile(value: blueprint.torqueAtWheel > 0 ? "\(Int(blueprint.torqueAtWheel))" : "--",
                              sub: "WTQ", color: .blue)
                    Divider()
                    PowerTile(value: blueprint.torqueAtCrank > 0 ? "\(Int(blueprint.torqueAtCrank))" : "--",
                              sub: "BTQ", color: .indigo)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 4)
            }

            // Block & Displacement
            Section("Block & Displacement") {
                LabeledContent("Layout", value: blueprint.layout.rawValue)
                if blueprint.displacement > 0 {
                    LabeledContent("Displacement", value: String(format: "%.2f L", blueprint.displacement))
                }
                if blueprint.bore > 0 {
                    LabeledContent("Bore", value: String(format: "%.2f mm", blueprint.bore))
                }
                if blueprint.stroke > 0 {
                    LabeledContent("Stroke", value: String(format: "%.2f mm", blueprint.stroke))
                }
                if blueprint.bore > 0 && blueprint.stroke > 0 {
                    LabeledContent("Calc. Displacement", value: String(format: "%.3f L", blueprint.calculatedDisplacement))
                }
                if blueprint.compressionRatio > 0 {
                    LabeledContent("Compression Ratio", value: String(format: "%.1f:1", blueprint.compressionRatio))
                }
                if !blueprint.blockMaterial.isEmpty {
                    LabeledContent("Block Material", value: blueprint.blockMaterial)
                }
            }

            // Head
            Section("Cylinder Head") {
                if !blueprint.headMaterial.isEmpty {
                    LabeledContent("Head Material", value: blueprint.headMaterial)
                }
                LabeledContent("Valves / Cylinder", value: "\(blueprint.valvesPerCylinder)")
                if !blueprint.camshaftType.isEmpty {
                    LabeledContent("Cam Type", value: blueprint.camshaftType)
                }
            }

            // Aspiration
            Section("Aspiration") {
                LabeledContent("Type", value: blueprint.aspirationType.rawValue)
                if blueprint.boostPressure > 0 {
                    LabeledContent("Boost", value: String(format: "%.1f psi", blueprint.boostPressure))
                }
                if blueprint.aspirationType != .naturallyAspirated {
                    LabeledContent("Intercooled", value: blueprint.intercooled ? "Yes" : "No")
                }
            }

            // Fuel
            Section("Fuel & Injection") {
                LabeledContent("Fuel Type", value: blueprint.fuelType.rawValue)
                if !blueprint.injectionType.isEmpty {
                    LabeledContent("Injection", value: blueprint.injectionType)
                }
                if blueprint.targetAFR > 0 {
                    LabeledContent("Target AFR", value: String(format: "%.2f", blueprint.targetAFR))
                }
            }

            // Tune
            Section("Tune") {
                if !blueprint.tuner.isEmpty {
                    LabeledContent("Tuner", value: blueprint.tuner)
                }
                if !blueprint.tuneNotes.isEmpty {
                    Text(blueprint.tuneNotes).foregroundStyle(.secondary)
                }
                if blueprint.tuner.isEmpty && blueprint.tuneNotes.isEmpty {
                    Text("No tune info recorded.").foregroundStyle(.tertiary)
                }
            }

            // Internals
            if !blueprint.internalsNotes.isEmpty {
                Section("Internals Notes") {
                    Text(blueprint.internalsNotes).foregroundStyle(.secondary)
                }
            }

            Section("Metadata") {
                LabeledContent("Last Updated", value: blueprint.updatedAt.formatted(date: .abbreviated, time: .shortened))
            }
        }
        .navigationTitle("Engine Blueprint")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") { isEditing = true }
            }
        }
        .sheet(isPresented: $isEditing) {
            EditEngineBlueprintView(blueprint: blueprint)
        }
    }
}

struct PowerTile: View {
    let value: String
    let sub: String
    let color: Color

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.title3.bold())
                .foregroundStyle(color)
            Text(sub)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
}
