frappe.ui.form.on('Monthly Distribution', {
  onload(frm) {
      console.log("Monthly Distribution script loaded")
    let textTitles = document.getElementsByClassName("ellipsis title-text")
    
    if (textTitles.length > 1) {
        textTitles = [].filter.call(textTitles, titleElement => (
            !titleElement.innerText.includes("Monthly Distribution") &&
            !titleElement.innerText.includes("Budget")
          ))
        if (textTitles.length === 1) {
            const linkedBudgetDocumentName = textTitles[0].innerText
            console.info("Budget linked document:", linkedBudgetDocumentName)
            
            cur_frm.set_value("distribution_id", linkedBudgetDocumentName)
            
            frappe.call({
                    method: 'frappe.client.get',
                    args: {
                        'doctype': 'Budget',
                        'filters': {'name': linkedBudgetDocumentName},
                    },
                    callback: function(r) {
                        if (!r.exc) {
                            const budget = r.message
                            if (budget.accounts) {
                                if (Array.isArray(budget.accounts) && budget.accounts.length > 0) {
                                    const totalBudgetAmount = budget.accounts.reduce((acc, obj) => acc + obj.budget_amount, 0)
                                    const monthlyAmount = parseFloat((totalBudgetAmount / 12).toFixed(0))
                                    const remainder = totalBudgetAmount - (monthlyAmount * 12)
                                    
                                    $.each(frm.doc.percentages || [], (i, v) => {
                              frappe.model.set_value(v.doctype, v.name, "value_allocation", i === frm.doc.percentages.length - 1 ? monthlyAmount + remainder : monthlyAmount)
                            })
                                } else {
                                    console.error("Monthly Distribution Error:", "accounts field is empty")
                                }
                            } else {
                                console.error("Monthly Distribution Error:", "Budget has no accounts field")
                            }
                        }
                    }
                })
        } else {
            console.error("Monthly Distribution Error:", "textTitles contains more than 1 element")
            console.error("textTitles:", textTitles)
        } 
    }
  }
})
