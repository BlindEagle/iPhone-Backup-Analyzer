import SwiftUI

struct EditEngineBlueprintView: View {
    @Bindable var blueprint: EngineBlueprint
    @Environment(\.dismiss) private var dismiss

    // Local string state for numeric fields to allow clean editing
    @State private var displacementText: String
    @State private var boreText: String
    @State private var strokeText: String
    @State private var compressionText: String
    @State private var boostText: String
    @State private var afrText: String
    @State private var whpText: String
    @State private var bhpText: String
    @State private var wtqText: String
    @State private var btqText: String

    init(blueprint: EngineBlueprint) {
        self.blueprint = blueprint
        _displacementText = State(initialValue: blueprint.displacement > 0 ? String(format: "%.2f", blueprint.displacement) : "")
        _boreText = State(initialValue: blueprint.bore > 0 ? String(format: "%.2f", blueprint.bore) : "")
        _strokeText = State(initialValue: blueprint.stroke > 0 ? String(format: "%.2f", blueprint.stroke) : "")
        _compressionText = State(initialValue: blueprint.compressionRatio > 0 ? String(format: "%.1f", blueprint.compressionRatio) : "")
        _boostText = State(initialValue: blueprint.boostPressure > 0 ? String(format: "%.1f", blueprint.boostPressure) : "")
        _afrText = State(initialValue: blueprint.targetAFR > 0 ? String(format: "%.2f", blueprint.targetAFR) : "")
        _whpText = State(initialValue: blueprint.horsepowerAtWheel > 0 ? "\(Int(blueprint.horsepowerAtWheel))" : "")
        _bhpText = State(initialValue: blueprint.horsepowerAtCrank > 0 ? "\(Int(blueprint.horsepowerAtCrank))" : "")
        _wtqText = State(initialValue: blueprint.torqueAtWheel > 0 ? "\(Int(blueprint.torqueAtWheel))" : "")
        _btqText = State(initialValue: blueprint.torqueAtCrank > 0 ? "\(Int(blueprint.torqueAtCrank))" : "")
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Block & Displacement") {
                    Picker("Layout", selection: $blueprint.layout) {
                        ForEach(EngineLayout.allCases, id: \.self) { Text($0.rawValue).tag($0) }
                    }
                    NumericField(label: "Displacement (L)", text: $displacementText) { blueprint.displacement = Double($0) ?? 0 }
                    NumericField(label: "Bore (mm)", text: $boreText) { blueprint.bore = Double($0) ?? 0 }
                    NumericField(label: "Stroke (mm)", text: $strokeText) { blueprint.stroke = Double($0) ?? 0 }
                    NumericField(label: "Compression Ratio", text: $compressionText) { blueprint.compressionRatio = Double($0) ?? 0 }
                    TextField("Block Material", text: $blueprint.blockMaterial)
                }

                Section("Cylinder Head") {
                    TextField("Head Material", text: $blueprint.headMaterial)
                    Stepper("Valves / Cyl: \(blueprint.valvesPerCylinder)", value: $blueprint.valvesPerCylinder, in: 2...6)
                    TextField("Camshaft Type (DOHC, SOHC...)", text: $blueprint.camshaftType)
                }

                Section("Aspiration") {
                    Picker("Type", selection: $blueprint.aspirationType) {
                        ForEach(AspirationType.allCases, id: \.self) { Text($0.rawValue).tag($0) }
                    }
                    if blueprint.aspirationType != .naturallyAspirated {
                        NumericField(label: "Boost (psi)", text: $boostText) { blueprint.boostPressure = Double($0) ?? 0 }
                        Toggle("Intercooled", isOn: $blueprint.intercooled)
                    }
                }

                Section("Fuel & Injection") {
                    Picker("Fuel Type", selection: $blueprint.fuelType) {
                        ForEach(FuelType.allCases, id: \.self) { Text($0.rawValue).tag($0) }
                    }
                    TextField("Injection Type", text: $blueprint.injectionType)
                    NumericField(label: "Target AFR", text: $afrText) { blueprint.targetAFR = Double($0) ?? 0 }
                }

                Section("Power Output") {
                    NumericField(label: "Wheel HP (whp)", text: $whpText) { blueprint.horsepowerAtWheel = Double($0) ?? 0 }
                    NumericField(label: "Crank HP (bhp)", text: $bhpText) { blueprint.horsepowerAtCrank = Double($0) ?? 0 }
                    NumericField(label: "Wheel Torque (ft-lb)", text: $wtqText) { blueprint.torqueAtWheel = Double($0) ?? 0 }
                    NumericField(label: "Crank Torque (ft-lb)", text: $btqText) { blueprint.torqueAtCrank = Double($0) ?? 0 }
                }

                Section("Tune") {
                    TextField("Tuner", text: $blueprint.tuner)
                    TextEditor(text: $blueprint.tuneNotes)
                        .frame(minHeight: 60)
                }

                Section("Internals Notes") {
                    TextEditor(text: $blueprint.internalsNotes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Edit Blueprint")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        blueprint.updatedAt = Date()
                        dismiss()
                    }
                }
            }
        }
    }
}

struct NumericField: View {
    let label: String
    @Binding var text: String
    let onCommit: (String) -> Void

    var body: some View {
        HStack {
            Text(label)
            Spacer()
            TextField("—", text: $text)
                .keyboardType(.decimalPad)
                .multilineTextAlignment(.trailing)
                .frame(width: 100)
                .onChange(of: text) { _, new in onCommit(new) }
        }
    }
}
