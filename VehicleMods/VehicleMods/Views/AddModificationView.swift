import SwiftUI
import SwiftData

struct AddModificationView: View {
    let vehicle: Vehicle
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var brand = ""
    @State private var partNumber = ""
    @State private var category: ModificationCategory = .other
    @State private var status: ModificationStatus = .planned
    @State private var installDate = Date()
    @State private var hasInstallDate = false
    @State private var cost = ""
    @State private var notes = ""

    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        NavigationStack {
            Form {
                Section("Part Info") {
                    TextField("Part Name *", text: $name)
                    TextField("Brand / Manufacturer", text: $brand)
                    TextField("Part Number", text: $partNumber)
                        .textInputAutocapitalization(.characters)
                }
                Section("Classification") {
                    Picker("Category", selection: $category) {
                        ForEach(ModificationCategory.allCases, id: \.self) { cat in
                            Label(cat.rawValue, systemImage: cat.systemImage).tag(cat)
                        }
                    }
                    Picker("Status", selection: $status) {
                        ForEach(ModificationStatus.allCases, id: \.self) { s in
                            Text(s.rawValue).tag(s)
                        }
                    }
                }
                Section("Cost & Date") {
                    HStack {
                        Text("$")
                        TextField("0.00", text: $cost)
                            .keyboardType(.decimalPad)
                    }
                    Toggle("Has Install Date", isOn: $hasInstallDate)
                    if hasInstallDate {
                        DatePicker("Install Date", selection: $installDate, displayedComponents: .date)
                    }
                }
                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Add Modification")
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
        let mod = Modification(
            name: name,
            brand: brand,
            partNumber: partNumber,
            category: category,
            status: status,
            installDate: hasInstallDate ? installDate : nil,
            cost: Double(cost) ?? 0,
            notes: notes
        )
        modelContext.insert(mod)
        vehicle.modifications.append(mod)
        dismiss()
    }
}
