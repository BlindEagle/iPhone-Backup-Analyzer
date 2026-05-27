import SwiftUI

struct EditVehicleView: View {
    @Bindable var vehicle: Vehicle
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Vehicle Info") {
                    Picker("Year", selection: $vehicle.year) {
                        ForEach((1900...Calendar.current.component(.year, from: Date()) + 1).reversed(), id: \.self) {
                            Text(String($0)).tag($0)
                        }
                    }
                    TextField("Make", text: $vehicle.make)
                    TextField("Model", text: $vehicle.model)
                    TextField("Trim", text: $vehicle.trim)
                }
                Section("Identification") {
                    TextField("VIN", text: $vehicle.vin)
                        .textInputAutocapitalization(.characters)
                        .font(.system(.body, design: .monospaced))
                }
                Section("Notes") {
                    TextEditor(text: $vehicle.notes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Edit Vehicle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
