#!/usr/bin/env python

import os
import markdown


class TemplateError(Exception):
    pass


def update_template(html_name, output_name):
    assert html_name.endswith('.html')
    with open(html_name) as html:
        html_data = html.read().decode('utf8')
    while True:
        index = html_data.find('{{')
        if index == -1:
            break
        end = html_data.find('}}', index)
        if end == -1:
            raise TemplateError("cannot find corresponding }}")
        if html_data[index + 2] != ' ' or html_data[end - 1] != ' ':
            raise TemplateError("no variable found")
        fname = html_data[index + 3:end - 1]
        with open(fname) as f:
            html_data = html_data[:index] + markdown.Markdown().convert(
                f.read().decode('utf8')) + html_data[end + 3:]
    with open(output_name[:-len('.html')] + '.html', 'w') as html_f:
        html_f.write(html_data.encode('utf8'))


if __name__ == '__main__':
    update_template('markdown/test.html', 'markdown/test_output.html')
