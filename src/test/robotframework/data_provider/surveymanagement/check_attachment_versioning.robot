*** Settings ***
Documentation  Test editing survey page and versioning
Resource  ../resources/login_resource.robot
Resource  ../resources/home_page_resource.robot
Resource  ../resources/search_resource.robot
Force Tags  smoketest  chromeonly

*** Test Cases ***
Editing survey attachement and check versioning
  Login as dataprovider
  Select project by name  fileuploadproject
  Click on surveys tab
  Click Survey Edit Button
  Click Edit Attachment Button
  Input Text  name=title  Test1337
  Click Attachment Save Button
  Click Edit Attachment Button
  Click Attachment Restore Dialogue
  Page Should Contain  vor ein paar Sekunden
  Revise to second latest version
  Click Attachment Save Button
  [Teardown]  Get back to home page and logout


*** Keywords ***
Get back to home page and logout
  Get back to german home page
  ${present}=  Run Keyword And Return Status    Page Should Contain  Sie haben ungespeicherte Änderungen.
  Run Keyword If    ${present} == 'True'   Click Element Through Tooltips  xpath=//button[contains(.,'Ja')]
  Click Element Through Tooltips  xpath=//button[@id='logout']

Click Edit Attachment Button
  Click Element Through Tooltips  xpath=//button[md-icon[text()='mode_edit']]

Click Attachment Save Button
  Click Element Through Tooltips  xpath=//form//button[md-icon[text()='save']]

Revise to second latest version
  Click Element Through Tooltips  xpath=//md-dialog//table//tr[2]

Click Attachment Restore Dialogue
  Click Element Through Tooltips  xpath=//form//button[md-icon[text()='undo']]
