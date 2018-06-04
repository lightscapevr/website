#!/usr/bin/env python

import os
import markdown

class TemplateError(Exception):
    pass

def update_template(tmpl_name):
    assert tmpl_name.endswith('.tmpl')
    with open(tmpl_name) as tmpl:
        tmpl_data = tmpl.read().decode('utf8')
    while True:
        index = tmpl_data.find('{{')
        if index == -1:
            break
        end = tmpl_data.find('}}', index)
        if end == -1:
            raise TemplateError("cannot find corresponding }}")
        if tmpl_data[index + 2] != ' ' or tmpl_data[end - 1] != ' ':
            raise TemplateError("no variable found")
        fname = tmpl_data[index + 3:end - 1]
        with open(fname) as f:
            tmpl_data = tmpl_data[:index] + markdown.Markdown().convert(f.read().decode('utf8')) + tmpl_data[end + 3:]
    with open(tmpl_name[:-len('.tmpl')] + '.html', 'w') as html_f:
        html_f.write(tmpl_data.encode('utf8'))

if __name__ == '__main__':
    update_template('web/documentation2.tmpl')
