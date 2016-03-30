# angular-table-fixed-rows

AngularJS module for fixed rows in table

## Install

```
bower install angular-table-fixed-rows
```

## Components

### table-fixed-row

Element will move to the container element in end of body tag. Container is a `<table></table>`, that copy class property and width of parent-table of the source element. 

*Directive*

Events

- `table-fixed-rows:refresh` - directive will refresh fixed header from source element

## How to use

```
// add module to dependencies

angular.module('app', [
  // ...
  'table-fixed-rows'
]);


```

```
<!-- Add directive to thead or tr block -->

<table class="table table-bordered">
  <thead table-fixed-row>
    <tr>
      <th>Index</th>
      <!-- ... -->
    </tr>
  </thead>
  <!-- ... -->
</table>
```

