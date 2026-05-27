import SwiftUI

struct EditModificationView: View {
    @Bindable var mod: Modification
    @Environment(\.dismiss) private var dismiss

    @State private var hasInstallDate: Bool
    @State private var costText: String

    init(mod: Modification) {
        self.mod = mod
        _hasInstallDate = State(initialValue: mod.installDate != nil)
        _costText = State(initialValue: mod.cost > 0 ? String(mod.cost) : "")
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Part Info") {
                    TextField("Part Name", text: $mod.name)
                    TextField("Brand", text: $mod.brand)
                    TextField("Part Number", text: $mod.partNumber)
                }
                Section("Classification") {
                    Picker("Category", selection: $mod.category) {
                        ForEach(ModificationCategory.allCases, id: \.self) { cat in
                            Label(cat.rawValue, systemImage: cat.systemImage).tag(cat)
                        }
                    }
                    Picker("Status", selection: $mod.status) {
                        ForEach(ModificationStatus.allCases, id: \.self) { s in
                            Text(s.rawValue).tag(s)
                        }
                    }
                }
                Section("Cost & Date") {
                    HStack {
                        Text("$")
                        TextField("0.00", text: $costText)
                            .keyboardType(.decimalPad)
                            .onChange(of: costText) { _, new in
                                mod.cost = Double(new) ?? 0
                            }
                    }
                    Toggle("Has Install Date", isOn: $hasInstallDate)
                        .onChange(of: hasInstallDate) { _, has in
                            mod.installDate = has ? (mod.installDate ?? Date()) : nil
                        }
                    if hasInstallDate, let date = Binding($mod.installDate) {
                        DatePicker("Install Date", selection: date, displayedComponents: .date)
                    }
                }
                Section("Notes") {
                    TextEditor(text: $mod.notes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Edit Modification")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
