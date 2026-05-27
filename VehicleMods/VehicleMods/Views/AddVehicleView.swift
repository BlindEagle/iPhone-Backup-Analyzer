import SwiftUI
import SwiftData

struct AddVehicleView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var year = Calendar.current.component(.year, from: Date())
    @State private var make = ""
    @State private var model = ""
    @State private var trim = ""
    @State private var vin = ""
    @State private var notes = ""

    private var isValid: Bool { !make.trimmingCharacters(in: .whitespaces).isEmpty && !model.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        NavigationStack {
            Form {
                Section("Vehicle Info") {
                    Picker("Year", selection: $year) {
                        ForEach((1900...Calendar.current.component(.year, from: Date()) + 1).reversed(), id: \.self) {
                            Text(String($0)).tag($0)
                        }
                    }
                    TextField("Make (e.g. Honda)", text: $make)
                    TextField("Model (e.g. Civic)", text: $model)
                    TextField("Trim (optional)", text: $trim)
                }
                Section("Identification") {
                    TextField("VIN (optional)", text: $vin)
                        .textInputAutocapitalization(.characters)
                        .font(.system(.body, design: .monospaced))
                }
                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Add Vehicle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") { save() }
                        .disabled(!isValid)
                }
            }
        }
    }

    private func save() {
        let vehicle = Vehicle(year: year, make: make, model: model, trim: trim, vin: vin, notes: notes)
        modelContext.insert(vehicle)
        dismiss()
    }
}
