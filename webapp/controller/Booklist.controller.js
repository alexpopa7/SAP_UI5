sap.ui.define([
    "sap/ui/core/mvc/Controller"
 ], function (Controller) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.Booklist", {
       
        onDeleteBook(oEvent) {
            const aSelContexts = this.byId("idBooksTable").getSelectedContexts()
        
            const sPathToBook = aSelContexts[0].getPath();
            this.getView().getModel().remove(sPathToBook);
        },

        onAddBook(oEvent) {
            this.dialog = sap.ui.xmlfragment("addBook","org.ubb.books.view.add", this);
            this.dialog.open();
        },

        onClosePressed(oEvent){
            this.dialog.close();
            this.dialog.destroy();
        },

        onSavePressed(oEvent){
            var oISBN = sap.ui.getCore().byId("addBook--idIsbn").getValue();
            var oTitle = sap.ui.getCore().byId("addBook--idTitle").getValue();
            var oAuthor = sap.ui.getCore().byId("addBook--idAuthor").getValue();
            var oLanguage = sap.ui.getCore().byId("addBook--idLanguage").getValue();
            var oDate = sap.ui.getCore().byId("addBook--idDate").getDateValue();
            var oTotal = sap.ui.getCore().byId("addBook--idTotalBooks").getValue();
            var oAvailable = sap.ui.getCore().byId("addBook--idAvailableBooks").getValue();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-ddTHH:mm:ss" }); 
            var date = new Date(oDate);  
            var dateFormatted = dateFormat.format(oDate);

            var oBook = {
                "Isbn": oISBN,
                "Titel": oTitle,
                "Author": oAuthor,
                "Language": oLanguage,
                "DatePublished": dateFormatted,
                "TotalNrOfBooks": parseInt(oTotal),
                "NrOfBooksAvailable": parseInt(oAvailable)
            };

            this.odataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z801_ODATA_ALPO_SRV");
            this.odataModel.create('/Z801_BOOK_ENTITYSet', oBook);
            this.dialog.close();
            this.dialog.destroy();
            window.location.reload();
        },

        onUpdateBook(oEvent){
            var oTable = this.getView().byId("idBooksTable");
            var selectedItem = oTable.getSelectedItem();

            var isbn = selectedItem.getBindingContext().getProperty("Isbn");
            var title = selectedItem.getBindingContext().getProperty("Titel");
            var author = selectedItem.getBindingContext().getProperty("Author");
            var language = selectedItem.getBindingContext().getProperty("Language");
            var date = selectedItem.getBindingContext().getProperty("DatePublished");
            var total = selectedItem.getBindingContext().getProperty("TotalNrOfBooks");
            var available = selectedItem.getBindingContext().getProperty("NrOfBooksAvailable");
            
            this.dialog = sap.ui.xmlfragment("updateBook","org.ubb.books.view.update", this);
            this.dialog.open();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "MMM dd, yyyy" }); 
            var date1 = new Date(date);  
            var dateFormatted = dateFormat.format(date1);

            sap.ui.getCore().byId("updateBook--idIsbn").setValue(isbn);
            sap.ui.getCore().byId("updateBook--idTitle").setValue(title);
            sap.ui.getCore().byId("updateBook--idAuthor").setValue(author);
            sap.ui.getCore().byId("updateBook--idLanguage").setValue(language);
            sap.ui.getCore().byId("updateBook--idDate").setValue(dateFormatted);
            sap.ui.getCore().byId("updateBook--idTotalBooks").setValue(total);
            sap.ui.getCore().byId("updateBook--idAvailableBooks").setValue(available);
        },

        onUpdatePressed(oEvent){
            var oISBN = sap.ui.getCore().byId("updateBook--idIsbn").getValue();
            var oTitle = sap.ui.getCore().byId("updateBook--idTitle").getValue();
            var oAuthor = sap.ui.getCore().byId("updateBook--idAuthor").getValue();
            var oLanguage = sap.ui.getCore().byId("updateBook--idLanguage").getValue();
            var oDate = sap.ui.getCore().byId("updateBook--idDate").getDateValue();
            var oTotal = sap.ui.getCore().byId("updateBook--idTotalBooks").getValue();
            var oAvailable = sap.ui.getCore().byId("updateBook--idAvailableBooks").getValue();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-ddTHH:mm:ss" }); 
            var date = new Date(oDate);  
            var dateFormatted = dateFormat.format(oDate);

            var oBook = {
                "Isbn": oISBN,
                "Titel": oTitle,
                "Author": oAuthor,
                "Language": oLanguage,
                "DatePublished": dateFormatted,
                "TotalNrOfBooks": parseInt(oTotal),
                "NrOfBooksAvailable": parseInt(oAvailable)
            };

            this.odataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z801_ODATA_ALPO_SRV");
            this.odataModel.update("/Z801_BOOK_ENTITYSet('"+oISBN+"')", oBook, null, function(){
                alert("Update successful");
                }, function(){
                    alert("Error!");
                }
            );

            this.dialog.close();
            this.dialog.destroy();
            window.location.reload();
        }

    });
 });