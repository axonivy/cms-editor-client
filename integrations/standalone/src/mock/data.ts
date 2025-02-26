import type { CmsData } from '@axonivy/cms-editor-protocol';

export const contentObjects: CmsData = {
  data: [
    { uri: '/Dialogs', values: {} },
    { uri: '/Dialogs/agileBPM', values: {} },
    { uri: '/Dialogs/agileBPM/define_WF', values: {} },
    { uri: '/Dialogs/agileBPM/define_WF/AddTask', values: { de: 'Aufgabe zum Ablauf hinzufügen', en: 'Add a task to the sequence' } },
    { uri: '/Dialogs/agileBPM/define_WF/AdhocWorkflowTasks', values: { de: 'Workflow Aufgaben', en: 'Workflow Tasks' } },
    { uri: '/Dialogs/agileBPM/define_WF/Case', values: { de: 'Fall', en: 'Case' } },
    {
      uri: '/Dialogs/agileBPM/define_WF/CommaSeparatedListOfUsers',
      values: { de: 'Komma getrennte Liste von Benutzern:', en: 'Comma separated list of users:' }
    },
    { uri: '/Dialogs/agileBPM/define_WF/Creator', values: { de: 'ERSTELLER', en: 'CREATOR' } },
    { uri: '/Dialogs/agileBPM/define_WF/DeleteStep', values: { de: 'Diesen Schritt löschen', en: 'Delete this Step' } },
    { uri: '/Dialogs/agileBPM/define_WF/Details', values: { de: 'Details', en: 'Details' } },
    { uri: '/Dialogs/agileBPM/define_WF/ForwardTo', values: { de: 'Weiterleiten an:', en: 'Forward to: ' } },
    { uri: '/Dialogs/agileBPM/define_WF/Ok', values: { de: 'OK', en: 'OK' } },
    { uri: '/Dialogs/agileBPM/define_WF/PatternAdHoc', values: { de: 'Ad-Hoc', en: 'Ad-hoc' } },
    { uri: '/Dialogs/agileBPM/define_WF/PatternApproval', values: { de: 'Freigabe', en: 'Approval' } },
    { uri: '/Dialogs/agileBPM/define_WF/PatternQA', values: { de: 'Frage-Antwort', en: 'Question-Answer' } },
    { uri: '/Dialogs/agileBPM/define_WF/PatternTodo', values: { de: 'ToDo', en: 'ToDo' } },
    { uri: '/Dialogs/agileBPM/define_WF/ResponsableUsers', values: { de: 'Verantwortlicher Benutzer', en: 'Responsable Users' } },
    { uri: '/Dialogs/agileBPM/define_WF/SequenceOfTasks', values: { de: 'Nachfolgende Aufgaben', en: 'Following Tasks' } },
    { uri: '/Dialogs/agileBPM/define_WF/ShowDetails', values: { de: 'Zeige Details zu den Vorlagen', en: 'Show details to the patterns' } },
    { uri: '/Dialogs/agileBPM/define_WF/StartWF', values: { de: 'Workflow starten', en: 'Start Workflow' } },
    { uri: '/Dialogs/agileBPM/define_WF/TaskActor', values: { de: 'Ausführender Benutzer', en: 'TaskActor' } },
    { uri: '/Dialogs/agileBPM/define_WF/TaskDescription', values: { de: 'Beschreibung der Aufgabe', en: 'Task Description' } },
    { uri: '/Dialogs/agileBPM/define_WF/TaskSubject', values: { de: 'Name der Aufgabe', en: 'Task Name' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFAttachment', values: { de: 'Anhang', en: 'Attachment' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFCategory', values: { de: 'Kategorie', en: 'Category' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFDescription', values: { de: 'Beschreibung', en: 'Description' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFPattern', values: { de: 'Vorlage', en: 'Pattern' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFSubject', values: { de: 'Betreff', en: 'Subject' } },
    { uri: '/Dialogs/agileBPM/define_WF/WFUser', values: { de: 'WF Benutzer', en: 'WF User' } },
    { uri: '/Dialogs/agileBPM/define_WF/Workflow', values: { de: 'Workflow', en: 'Workflow' } },
    { uri: '/Dialogs/agileBPM/define_WF/YourComment', values: { de: 'Ihr Kommentar', en: 'Your comment' } },
    { uri: '/Dialogs/agileBPM/task_Form', values: {} },
    { uri: '/Dialogs/agileBPM/task_Form/AddAdHocTask', values: { de: 'Ad-Hoc Aufgabe hinzufügen', en: 'Add ad-hoc task' } },
    { uri: '/Dialogs/agileBPM/task_Form/Append', values: { de: 'Anfügen', en: 'Append' } },
    {
      uri: '/Dialogs/agileBPM/task_Form/AppendATaskAfter',
      values: { de: 'Eine Aufgabe im Ablauf nach meiner Aufgabe einfügen.', en: 'Add a task into the sequence following my task.' }
    },
    { uri: '/Dialogs/agileBPM/task_Form/AssignTo', values: { de: 'Zuweisen an', en: 'Assign to' } },
    { uri: '/Dialogs/agileBPM/task_Form/Attachment', values: { de: 'Anhang', en: 'Attachment' } },
    { uri: '/Dialogs/agileBPM/task_Form/Case', values: { de: 'Fall', en: 'Case' } },
    { uri: '/Dialogs/agileBPM/task_Form/ConfirmTodo', values: { de: 'Todo erledigt', en: 'Confirm the Todo' } },
    { uri: '/Dialogs/agileBPM/task_Form/Deadline', values: { de: 'Frist', en: 'Deadline' } },
    { uri: '/Dialogs/agileBPM/task_Form/Decision', values: { de: 'Entscheidung', en: 'Decision' } },
    { uri: '/Dialogs/agileBPM/task_Form/Decline', values: { de: 'Ablehnen', en: 'Decline' } },
    { uri: '/Dialogs/agileBPM/task_Form/DeclineTodo', values: { de: 'Aufgabe ablehnen', en: 'Decline the task' } },
    { uri: '/Dialogs/agileBPM/task_Form/DeleteTask', values: { de: 'Aufgabe löschen' } },
    { uri: '/Dialogs/agileBPM/task_Form/Description', values: { de: 'Beschreibung', en: 'Description' } },
    { uri: '/Dialogs/agileBPM/task_Form/Done', values: { de: 'Erledigt', en: 'Done' } },
    { uri: '/Dialogs/agileBPM/task_Form/Finish', values: { de: 'Beenden', en: 'Finish' } },
    { uri: '/Dialogs/agileBPM/task_Form/FollowUpQuestion', values: { de: 'Anschlussfrage', en: 'Follow-up question' } },
    {
      uri: '/Dialogs/agileBPM/task_Form/InsertATaskBefore',
      values: {
        de: 'Aufgabe vor meiner Aufgabe einfügen. Meine Aufgabe wird zurückgestellt.',
        en: 'Insert a task before my task. My task will be postboned.'
      }
    },
    { uri: '/Dialogs/agileBPM/task_Form/MyAnswer', values: { de: 'Meine Antwort', en: 'My answer' } },
    {
      uri: '/Dialogs/agileBPM/task_Form/MyTaskIsDoneAnd',
      values: { de: 'Meine Aufgabe ist erledigt und eine neue Aufgabe wurde angefügt', en: 'My task is done and the new task is appended' }
    },
    { uri: '/Dialogs/agileBPM/task_Form/NoNOK', values: { de: 'Nein, nicht ok', en: 'No, not ok' } },
    { uri: '/Dialogs/agileBPM/task_Form/Remarks', values: { de: 'Anmerkungen', en: 'Remarks' } },
    { uri: '/Dialogs/agileBPM/task_Form/Send', values: { de: 'Senden', en: 'Send' } },
    { uri: '/Dialogs/agileBPM/task_Form/Task', values: { de: 'Aufgabe', en: 'Task' } },
    { uri: '/Dialogs/agileBPM/task_Form/Workflow', values: { de: 'Workflow', en: 'Workflow' } },
    { uri: '/Dialogs/agileBPM/task_Form/YesOK', values: { de: 'Ja, ok', en: 'Yes, its ok' } },
    { uri: '/Dialogs/agileBPM/task_Form/YourComment', values: { de: 'Ihr Kommentar', en: 'Your comment' } },
    { uri: '/Dialogs/agileBPM/task_Form/YourDecision', values: { de: 'Ihre Entscheidung', en: 'Your decision' } },
    { uri: '/Dialogs/general', values: {} },
    { uri: '/Dialogs/general/locale', values: { en: 'de_CH' } },
    { uri: '/Dialogs/general/name', values: { de: 'Name', en: 'Name' } },
    { uri: '/Dialogs/general/proceed', values: { de: 'Durchführen', en: 'Proceed' } },
    { uri: '/Dialogs/procurementRequest', values: {} },
    { uri: '/Dialogs/procurementRequest/accept', values: { de: 'Akzeptieren', en: 'Accept' } },
    {
      uri: '/Dialogs/procurementRequest/acceptDescription',
      values: {
        de: 'Der nachfolgende Beschaffungsantrag muss beantwortet werden:',
        en: 'The following procurement request needs to be answered:'
      }
    },
    { uri: '/Dialogs/procurementRequest/acceptedBy', values: { de: 'Angenommen von', en: 'Accepted by' } },
    { uri: '/Dialogs/procurementRequest/AcceptTitle', values: { de: 'Beschaffungstrag annehmen', en: 'Accept Procurement Request' } },
    { uri: '/Dialogs/procurementRequest/amount', values: { de: 'Menge', en: 'Amount' } },
    { uri: '/Dialogs/procurementRequest/currencySymbol', values: { de: '$', en: '$' } },
    { uri: '/Dialogs/procurementRequest/decline', values: { de: 'Ablehnen', en: 'Decline' } },
    { uri: '/Dialogs/procurementRequest/declinedBy', values: { de: 'Abgelehnt von', en: 'Declined by' } },
    { uri: '/Dialogs/procurementRequest/description', values: { de: 'Beschreibung', en: 'Description' } },
    {
      uri: '/Dialogs/procurementRequest/enterDescription',
      values: { de: 'Bitte geben Sie die Antragsdaten ein.', en: 'Please enter your request data.' }
    },
    { uri: '/Dialogs/procurementRequest/enterTitle', values: { de: 'Beschaffungsantrag erfassen', en: 'Enter Procurement Request' } },
    { uri: '/Dialogs/procurementRequest/forTotal', values: { de: 'zum Gesamtpreis von', en: 'for a total of' } },
    { uri: '/Dialogs/procurementRequest/notes', values: { de: 'Notizen', en: 'Notes' } },
    { uri: '/Dialogs/procurementRequest/piecesOf', values: { de: 'Stück', en: 'pieces of' } },
    { uri: '/Dialogs/procurementRequest/pricePerUnit', values: { de: 'Stückpreis', en: 'Price per Unit' } },
    { uri: '/Dialogs/procurementRequest/requestedBy', values: { de: 'Beantragt von', en: 'Requested by' } },
    { uri: '/Dialogs/procurementRequest/totalPrice', values: { de: 'Total', en: 'Total' } },
    { uri: '/Dialogs/procurementRequest/verified', values: { de: 'Prüfen', en: 'Verify' } },
    { uri: '/Dialogs/procurementRequest/verifiedBy', values: { de: 'Geprüft von', en: 'Verified by' } },
    { uri: '/Dialogs/procurementRequest/verify', values: { de: 'Prüfen', en: 'Verify' } },
    {
      uri: '/Dialogs/procurementRequest/verifyDescription',
      values: {
        de: 'Der nachfolgende Beschaffungsantrag muss geprüft werden:',
        en: 'The following procurement request needs to be verified:'
      }
    },
    { uri: '/Dialogs/procurementRequest/verifyTitle', values: { de: 'Beschaffungsantrag prüfen', en: 'Verify Procurement Request' } },
    { uri: '/Dialogs/signal', values: {} },
    { uri: '/Dialogs/signal/city', values: { de: 'Stadt', en: 'City' } },
    { uri: '/Dialogs/signal/createProcesses', values: { de: 'Prozesse erstellen', en: 'Create Processes' } },
    {
      uri: '/Dialogs/signal/CreateUserDescription',
      values: { de: 'Bitte geben Sie die Daten des neuen Mitarbeiters ein.', en: 'Please insert the new employees data' }
    },
    { uri: '/Dialogs/signal/CreateUserTitle', values: { de: 'Neuer Mitarbeiter', en: 'New Employee' } },
    { uri: '/Dialogs/signal/Finish', values: { de: 'Beenden', en: 'Finish' } },
    { uri: '/Dialogs/signal/name', values: { de: 'Name', en: 'Name' } },
    { uri: '/Dialogs/signal/QuitSignalSent', values: { de: 'Mitarbeiter erfolgreich ausgetreten.', en: 'Employee successfully quit.' } },
    {
      uri: '/Dialogs/signal/QuitUserDescription',
      values: {
        de: 'Bitte geben Sie die Benutzerkennung des austretenden Mitarbeiters an.',
        en: 'Please insert the User Key of the leaving employee.'
      }
    },
    { uri: '/Dialogs/signal/QuitUserTitle', values: { de: 'Mitarbeiteraustritt', en: 'Quit Employee' } },
    { uri: '/Dialogs/signal/reason', values: { de: 'Begründung', en: 'Reason' } },
    { uri: '/Dialogs/signal/street', values: { de: 'Strasse', en: 'Street' } },
    { uri: '/Dialogs/signal/userKey', values: { de: 'Benutzerkennung', en: 'User Key' } },
    { uri: '/Dialogs/trigger', values: {} },
    { uri: '/Dialogs/trigger/dateOfBirth', values: { de: 'Geburtsdatum', en: 'Date Of Birth' } },
    { uri: '/Dialogs/trigger/email', values: { de: 'E-Mail', en: 'E-Mail' } },
    { uri: '/Dialogs/trigger/employee', values: { de: 'Mitarbeiter', en: 'Employee' } },
    { uri: '/Dialogs/trigger/isNotAValidEmailAddress', values: { de: 'E-Mail-Adresse ungültig', en: 'E-mail: Not valid.' } },
    { uri: '/Dialogs/trigger/newEmployeeTitle', values: { de: 'Neuer Mitarbeiter', en: 'New Employee' } },
    { uri: '/Dialogs/trigger/parkingLotNeeded', values: { de: 'Parkplatz benötigt', en: 'Parking Lot needed' } },
    { uri: '/Dialogs/trigger/parkingLotNr', values: { de: 'Parkplatznr.', en: 'Parking Lot Nr.' } },
    { uri: '/Dialogs/trigger/selectParkingLot', values: { de: 'Parkplatz auswählen', en: 'Select parking lot' } }
  ]
};
