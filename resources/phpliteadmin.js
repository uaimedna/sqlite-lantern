//initiated autoincrement checkboxes
function initAutoincrement()
{
	var i=0;
	while(document.getElementById('i'+i+'_autoincrement')!=undefined)
	{
		document.getElementById('i'+i+'_autoincrement').disabled = true;
		i++;
	}
}
//makes sure autoincrement can only be selected when integer type is selected
function toggleAutoincrement(i)
{
	var type = document.getElementById('i'+i+'_type');
	var primarykey = document.getElementById('i'+i+'_primarykey');
	var autoincrement = document.getElementById('i'+i+'_autoincrement');
	if(!autoincrement) return false;
	if(type.value=='INTEGER' && primarykey.checked)
		autoincrement.disabled = false;
	else
	{
		autoincrement.disabled = true;
		autoincrement.checked = false;
	}
}
function toggleNull(i)
{
	var pk = document.getElementById('i'+i+'_primarykey');
	var notnull = document.getElementById('i'+i+'_notnull');
	if(pk.checked)
	{
		notnull.disabled = true;
		notnull.checked = true;
	}
	else
	{
		notnull.disabled = false;
	}
}
//finds and checks all checkboxes for all rows on the Browse or Structure tab for a table
function checkAll()
{
	var i=0;
	while(document.getElementById('check_'+i)!=undefined)
	{
		document.getElementById('check_'+i).checked = true;
		i++;
	}
}
//finds and unchecks all checkboxes for all rows on the Browse or Structure tab for a table
function uncheckAll()
{
	var i=0;
	while(document.getElementById('check_'+i)!=undefined)
	{
		document.getElementById('check_'+i).checked = false;
		i++;
	}
}
//unchecks the ignore checkbox if user has typed something into one of the fields for adding new rows
function changeIgnore(area, e, u)
{
	if(area.value!="")
	{
		if(document.getElementById(e)!=undefined)
			document.getElementById(e).checked = false;
		if(document.getElementById(u)!=undefined)
			document.getElementById(u).checked = false;
	}
}
//moves fields from select menu into query textarea for SQL tab
function moveFields()
{
	var fields = document.getElementById("fieldcontainer");
	var selected = [];
	for(var i=0; i<fields.options.length; i++)
		if(fields.options[i].selected)
			selected.push(fields.options[i].value);
	for(var i=0; i<selected.length; i++)
	{
		var val = '"'+selected[i].replace(/"/g,'""')+'"';
		if(i < selected.length-1)
			val += ', ';
		sqleditorInsertValue(val);
	}
}

function notNull(checker)
{
	document.getElementById(checker).checked = false;
}

function disableText(checker, textie)
{
	if(checker.checked)
	{
		document.getElementById(textie).value = "";
		document.getElementById(textie).disabled = true;	
	}
	else
	{
		document.getElementById(textie).disabled = false;	
	}
}

function toggleExports(val)
{
	document.getElementById("exportoptions_sql").style.display = "none";	
	document.getElementById("exportoptions_csv").style.display = "none";	
	
	document.getElementById("exportoptions_"+val).style.display = "block";	
}

function toggleImports(val)
{
	document.getElementById("importoptions_sql").style.display = "none";	
	document.getElementById("importoptions_csv").style.display = "none";	
	
	document.getElementById("importoptions_"+val).style.display = "block";	
}

function checkLike(srchField, selOpt)
{
	if(selOpt=="LIKE%"){
		var textArea = document.getElementById(srchField);
		textArea.value = "%" + textArea.value + "%";
	}
}

// Cross Origin Request
var codeEditor;
var sqlTextarea;

function createSqlCodeEditor(textarea, options) {
	return CodeMirror.fromTextArea(textarea, Object.assign({
		lineNumbers: true,
		matchBrackets: true,
		indentUnit: 4,
		lineWrapping: true,
		mode: 'text/x-sqlite'
	}, options));
}

function sqleditor(textarea, tableDefinitions, tableDefault)
{
	sqlTextarea = textarea;
	if (typeof CodeMirror === 'undefined' || !CodeMirror.hint || !CodeMirror.hint.sql)
		return;
	codeEditor = createSqlCodeEditor(textarea, {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		hint: CodeMirror.hint.sql,
		hintOptions: {
			completeSingle: false,
			completeOnSingleClick: true,
			defaultTable: tableDefault,
			tables: tableDefinitions
		}
	});
	codeEditor.on("inputRead", codemirrorAutocompleteOnInputRead);
}

function sqleditorSetValue(text)
{
	if (codeEditor)
		codeEditor.doc.setValue(text);
	else
		sqlTextarea.value = text;
}

function sqleditorInsertValue(text)
{
	if (codeEditor)
		codeEditor.doc.replaceRange(text, codeEditor.doc.getCursor("from"), codeEditor.doc.getCursor("to"));
	else if (sqlTextarea.setRangeText)
		sqlTextarea.setRangeText(text, sqlTextarea.selectionStart, sqlTextarea.selectionEnd, 'end');
	else
		sqlTextarea.value += text;
}

/**
 * "inputRead" event handler for CodeMirror SQL query editors for autocompletion
 * Most of it from: https://github.com/phpmyadmin/phpmyadmin/blob/master/js/functions.js
 */
function codemirrorAutocompleteOnInputRead(instance) {
	if (instance.state.completionActive) {
		return;
	}
	var cur = instance.getCursor();
	var token = instance.getTokenAt(cur);
	var string = '';
	if (token.string.match(/^[.`"\w@]\w*$/))
	{
		string = token.string;
	}
	if (string.length > 0) {
		CodeMirror.commands.autocomplete(instance);
	}
}

function checkFileSize(input)
{
	if(input.files && input.files.length == 1)
	{
		if (input.files[0].size > fileUploadMaxSize) 
		{
			alert(fileUploadMaxSizeErrorMsg + ": " + (fileUploadMaxSize/1024/1024) + " MiB");
			return false;
		}
	}
	return true;
}
// Keep native disclosures as the fallback in browsers without the Popover API.
function enhanceWorkspacePopovers(workspace) {
	if (!('popover' in HTMLElement.prototype))
		return;

	workspace.querySelectorAll('details[data-popover]').forEach(function (disclosure, index) {
		var summary = disclosure.firstElementChild;
		var panel = summary.nextElementSibling;
		var wrapper = document.createElement('div');
		var button = document.createElement('button');

		wrapper.className = disclosure.className;
		button.type = 'button';
		button.className = summary.className;
		button.textContent = summary.textContent;
		if (summary.hasAttribute('aria-label'))
			button.setAttribute('aria-label', summary.getAttribute('aria-label'));

		panel.id = 'workspace-popover-' + index;
		panel.setAttribute('popover', 'auto');
		button.setAttribute('popovertarget', panel.id);
		wrapper.append(button, panel);
		disclosure.replaceWith(wrapper);
	});
}

var inlineSqlAssets;

function loadInlineSqlEditor(baseUrl) {
	if (!inlineSqlAssets) {
		function loadAsset(tag, path) {
			return new Promise(function (resolve, reject) {
				var asset = document.createElement(tag);
				asset.onload = resolve;
				asset.onerror = reject;
				if (tag === 'link') {
					asset.rel = 'stylesheet';
					asset.href = baseUrl + path;
				} else {
					asset.src = baseUrl + path;
				}
				document.head.appendChild(asset);
			});
		}
		inlineSqlAssets = Promise.all([
			loadAsset('link', 'codemirror.min.css'),
			loadAsset('script', 'codemirror.min.js').then(function () {
				return loadAsset('script', 'mode/sql/sql.min.js');
			})
		]).then(function () {
			return typeof CodeMirror !== 'undefined';
		}, function () {
			return false;
		});
	}
	return inlineSqlAssets;
}

function enhanceInlineSql(region) {
	var editor = region.querySelector('.inline-sql-editor');
	var form = editor.querySelector('form');
	var query = form.elements.queryval;
	var summary = editor.querySelector('summary');
	var cancel = form.querySelector('.inline-sql-cancel');
	var run = form.querySelector('button[type="submit"]');
	var feedback = form.querySelector('.inline-sql-feedback');
	var inlineCodeEditor;

	function runQuery() {
		if (!run.disabled)
			run.click();
	}

	editor.addEventListener('toggle', function () {
		if (!editor.open)
			return;
		if (inlineCodeEditor) {
			inlineCodeEditor.refresh();
			inlineCodeEditor.focus();
			return;
		}

		query.focus();
		if (!window.Promise)
			return;
		loadInlineSqlEditor(editor.dataset.editorAssets).then(function (available) {
			if (!available || !region.isConnected || !editor.open || inlineCodeEditor || run.disabled)
				return;

			var focused = document.activeElement === query;
			var start = query.selectionStart;
			var end = query.selectionEnd;
			query.required = false;
			inlineCodeEditor = createSqlCodeEditor(query, {
				extraKeys: { 'Ctrl-Enter': runQuery, 'Cmd-Enter': runQuery }
			});
			inlineCodeEditor.getInputField().setAttribute('aria-label', form.querySelector('label').textContent);
			if (focused) {
				inlineCodeEditor.setSelection(inlineCodeEditor.posFromIndex(start), inlineCodeEditor.posFromIndex(end));
				inlineCodeEditor.focus();
			}
		});
	});
	cancel.hidden = false;
	cancel.addEventListener('click', function () {
		form.reset();
		if (inlineCodeEditor)
			inlineCodeEditor.setValue(query.defaultValue);
		feedback.textContent = '';
		editor.open = false;
		summary.focus();
	});
	query.addEventListener('keydown', function (event) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			runQuery();
		}
	});

	if (!window.fetch || !window.DOMParser)
		return;

	form.addEventListener('submit', async function (event) {
		event.preventDefault();
		if (run.disabled)
			return;

		run.disabled = cancel.disabled = true;
		feedback.textContent = feedback.dataset.running;
		try {
			if (inlineCodeEditor)
				inlineCodeEditor.save();
			var response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
			var documentResult = new DOMParser().parseFromString(await response.text(), 'text/html');
			var results = documentResult.querySelector('[data-browse-results]');
			if (!response.ok || !results)
				throw new Error('Query response missing');

			if (inlineCodeEditor)
				inlineCodeEditor.toTextArea();
			region.replaceWith(results);
			enhanceInlineSql(results);
			if (results.querySelector('.sql-result-error')) {
				results.querySelector('.inline-sql-editor').open = true;
				results.querySelector('textarea').focus();
			} else {
				results.querySelector('.inline-sql-summary').focus();
			}
		} catch (error) {
			feedback.textContent = feedback.dataset.failed;
		} finally {
			run.disabled = cancel.disabled = false;
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	var browseResults = document.querySelector('[data-browse-results]');
	if (browseResults)
		enhanceInlineSql(browseResults);

	var workspace = document.querySelector('.workspace-layout');
	if (!workspace)
		return;

	enhanceWorkspacePopovers(workspace);

	var sidebar = workspace.querySelector('.sidebar-details');
	var mobile = window.matchMedia('(max-width: 760px)');
	function updateSidebar() {
		sidebar.open = !mobile.matches;
	}
	updateSidebar();
	if (mobile.addEventListener)
		mobile.addEventListener('change', updateSidebar);

	var activeTab = workspace.querySelector('.workspace-tabs .tab_pressed');
	if (activeTab) {
		activeTab.setAttribute('aria-current', 'page');
		var activeMenu = activeTab.closest('.operation-menu');
		if (activeMenu)
			activeMenu.classList.add('is-current');
	}

	workspace.querySelectorAll('#main table.viewTable').forEach(function (table) {
		if (table.parentElement.classList.contains('table-scroll'))
			return;

		var scroller = document.createElement('div');
		scroller.className = 'table-scroll';
		table.parentNode.insertBefore(scroller, table);
		scroller.appendChild(table);
	});

	var selectAll = workspace.querySelector('.select-schema-all');
	if (!selectAll)
		return;

	var form = selectAll.form;
	var rows = Array.from(form.querySelectorAll('input[name="check[]"]'));
	var bulkActions = form.querySelector('.bulk-actions');

	function updateSelection() {
		var count = rows.filter(function (checkbox) { return checkbox.checked; }).length;
		selectAll.checked = count === rows.length;
		selectAll.indeterminate = count > 0 && count < rows.length;
		bulkActions.hidden = count === 0;
	}

	form.querySelectorAll('.bulk-select-button').forEach(function (button) {
		button.hidden = true;
	});
	selectAll.hidden = false;
	selectAll.addEventListener('change', function () {
		rows.forEach(function (checkbox) { checkbox.checked = selectAll.checked; });
	});
	form.addEventListener('change', updateSelection);
	updateSelection();
});
