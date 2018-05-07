*** Settings ***
Documentation     Resource used by all search and view test cases
Library           ExtendedSelenium2Library
Variables         ../common_variables.yaml


*** Keywords ***

Search for
            [Arguments]    ${arg_name}
            Input Text             id=query    ${arg_name}
Click on search result by id
            [Arguments]    ${arg_name}
            Wait Until Keyword Succeeds  5s  1s  Click Element Through Tooltips   xpath=//a//span[text()='${arg_name}']
