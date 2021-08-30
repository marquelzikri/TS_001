frappe.ui.form.on('Budget', {
  refresh(frm) {
    frm.set_query("monthly_distribution", function() {
      return {
        filters: [
          ["Monthly Distribution"," name", "=", frm.docname]
        ]
      }
    })
  }
})
