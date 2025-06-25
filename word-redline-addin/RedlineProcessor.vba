Sub ProcessRedlineInstructions()
'
' Redline Processor Macro - Alternative to Office Add-in
' This macro processes redline instructions and applies them as track changes
'
    Dim instructions As String
    Dim lines() As String
    Dim i As Integer
    Dim result As String
    
    ' Enable track changes
    ActiveDocument.TrackRevisions = True
    
    ' Get redline instructions from user
    instructions = InputBox( _
        "Enter redline instructions (one per line):" & vbCrLf & vbCrLf & _
        "Examples:" & vbCrLf & _
        "Change ""Company"" to ""Contractor""" & vbCrLf & _
        "Delete ""liquidated damages provision""" & vbCrLf & _
        "Add ""governed by California law"" at the end", _
        "Redline Processor", _
        "Change ""Company"" to ""Contractor""" & vbCrLf & _
        "Delete ""old text""" & vbCrLf & _
        "Add ""new text"" at the end")
    
    If instructions = "" Then
        MsgBox "No instructions provided.", vbInformation
        Exit Sub
    End If
    
    ' Split instructions into lines
    lines = Split(instructions, vbCrLf)
    result = "Processing Results:" & vbCrLf & vbCrLf
    
    ' Process each instruction
    For i = 0 To UBound(lines)
        If Trim(lines(i)) <> "" Then
            result = result & ProcessSingleInstruction(Trim(lines(i))) & vbCrLf
        End If
    Next i
    
    ' Show results
    MsgBox result, vbInformation, "Redline Processing Complete"
End Sub

Function ProcessSingleInstruction(instruction As String) As String
    Dim findText As String
    Dim replaceText As String
    Dim addText As String
    Dim instructionLower As String
    Dim startPos As Integer
    Dim endPos As Integer
    Dim count As Integer
    
    instructionLower = LCase(instruction)
    
    ' Handle "Change X to Y" or "Replace X with Y"
    If InStr(instructionLower, "change """) > 0 Or InStr(instructionLower, "replace """) > 0 Then
        ' Extract text between quotes
        startPos = InStr(instruction, """") + 1
        endPos = InStr(startPos, instruction, """")
        findText = Mid(instruction, startPos, endPos - startPos)
        
        ' Find "to" or "with"
        If InStr(instructionLower, " to """) > 0 Then
            startPos = InStr(instructionLower, " to """) + 5
        ElseIf InStr(instructionLower, " with """) > 0 Then
            startPos = InStr(instructionLower, " with """) + 7
        End If
        
        endPos = InStr(startPos, instruction, """")
        replaceText = Mid(instruction, startPos, endPos - startPos)
        
        ' Perform find and replace with track changes
        With ActiveDocument.Range.Find
            .Text = findText
            .Replacement.Text = replaceText
            .Forward = True
            .Wrap = wdFindContinue
            .Format = False
            .MatchCase = False
            .MatchWholeWord = False
            count = .Execute(Replace:=wdReplaceAll)
        End With
        
        ProcessSingleInstruction = "✓ Replaced """ & findText & """ with """ & replaceText & """ (" & count & " occurrences)"
        
    ' Handle "Delete X"
    ElseIf InStr(instructionLower, "delete """) > 0 Then
        startPos = InStr(instruction, """") + 1
        endPos = InStr(startPos, instruction, """")
        findText = Mid(instruction, startPos, endPos - startPos)
        
        ' Find and delete with track changes
        With ActiveDocument.Range.Find
            .Text = findText
            .Replacement.Text = ""
            .Forward = True
            .Wrap = wdFindContinue
            .Format = False
            .MatchCase = False
            .MatchWholeWord = False
            count = .Execute(Replace:=wdReplaceAll)
        End With
        
        ProcessSingleInstruction = "✓ Deleted """ & findText & """ (" & count & " occurrences)"
        
    ' Handle "Add X at the end"
    ElseIf InStr(instructionLower, "add """) > 0 Then
        startPos = InStr(instruction, """") + 1
        endPos = InStr(startPos, instruction, """")
        addText = Mid(instruction, startPos, endPos - startPos)
        
        ' Add at the end of document
        ActiveDocument.Range.InsertAfter vbCrLf & addText
        ProcessSingleInstruction = "✓ Added """ & addText & """ at the end"
        
    Else
        ProcessSingleInstruction = "❌ Could not parse: " & instruction
    End If
End Function

Sub EnableTrackChanges()
' Quick macro to enable track changes
    ActiveDocument.TrackRevisions = True
    MsgBox "Track changes enabled!", vbInformation
End Sub

Sub DisableTrackChanges()
' Quick macro to disable track changes
    ActiveDocument.TrackRevisions = False
    MsgBox "Track changes disabled!", vbInformation
End Sub