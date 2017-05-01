System.register([], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", function (url) {

        var core = {

          // Method that performs request
          req: function req(method, url, data, type) {
            // Creating a promise
            var promise = new Promise(function (resolve, reject) {

              // Instantiates the XMLHttpRequest
              var client = new XMLHttpRequest();
              var uri = url;
              var ts = new Date().getTime();

              client.open(method, uri, true);
              client.setRequestHeader("x-type", type ? type : "delayed");
              client.overrideMimeType('application/json');
              //client.setRequestHeader("Content-Type", "application/json;charset=utf-8");
              client.send(data);

              client.onload = function () {
                var statusClass = parseInt(client.status / 100);
                if (statusClass == 2 || statusClass == 3 || statusClass == 0 /* local files */) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(this.response);
                  } else {
                  // Performs the function "reject" when this.status is different than 2xx

                  reject(this.statusText);
                }
              };
              client.onerror = function () {
                reject(this.statusText);
              };
              client.ontimeout = function () {
                reject(this.statusText);
              };
            });

            // Return the promise
            return promise;
          }
        };

        return {
          'get': function get(args) {
            return core.req('GET', url, args);
          },
          'post': function post(args, type) {
            return core.req('POST', url, args, type);
          }
        };
      });
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93b3JrZXIvaHR0cC13b3JrZXIuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3lCQUFlLFVBQVUsR0FBRyxFQUFFOztBQUU3QixZQUFJLElBQUksR0FBRzs7O0FBR1IsYUFBRyxFQUFHLGFBQVUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOztBQUV6QyxnQkFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFOzs7QUFHbEQsa0JBQUksTUFBTSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7QUFDbEMsa0JBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkLGtCQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5QixvQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLG9CQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDM0Qsb0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU1QyxvQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEIsb0JBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWTtBQUMzQixvQkFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDL0Msb0JBQUcsV0FBVyxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksQ0FBQyxJQUFJLFdBQVcsSUFBSSxDQUFDLG9CQUFtQjs7QUFFNUUsMkJBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7bUJBQ3hCLE1BQU07OztBQUdMLHdCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUN6QjtlQUNGLENBQUM7QUFDRixvQkFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQzVCLHNCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2VBQ3hCLENBQUM7QUFDRixvQkFBTSxDQUFDLFNBQVMsR0FBRyxZQUFVO0FBQzVCLHNCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2VBQ3hCLENBQUM7YUFDSCxDQUFDLENBQUM7OztBQUdILG1CQUFPLE9BQU8sQ0FBQztXQUNoQjtTQUNGLENBQUM7O0FBR0YsZUFBTztBQUNOLGVBQUssRUFBRyxhQUFTLElBQUksRUFBRTtBQUN0QixtQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDbEM7QUFDRCxnQkFBTSxFQUFHLGNBQVMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUM3QixtQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQ3pDO1NBQ0QsQ0FBQztPQUNIIiwiZmlsZSI6Imhwbi93b3JrZXIvaHR0cC13b3JrZXIuZXMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodXJsKSB7XG5cblx0dmFyIGNvcmUgPSB7XG5cbiAgICAvLyBNZXRob2QgdGhhdCBwZXJmb3JtcyByZXF1ZXN0XG4gICAgcmVxIDogZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhLCB0eXBlKSB7XG5cdCAgICAgIC8vIENyZWF0aW5nIGEgcHJvbWlzZVxuXHQgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgLy8gSW5zdGFudGlhdGVzIHRoZSBYTUxIdHRwUmVxdWVzdFxuICAgICAgICB2YXIgY2xpZW50ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB1cmkgPSB1cmw7XG4gICAgICAgIHZhciB0cyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGNsaWVudC5vcGVuKG1ldGhvZCwgdXJpLCB0cnVlKTtcbiAgICAgICAgY2xpZW50LnNldFJlcXVlc3RIZWFkZXIoXCJ4LXR5cGVcIiwgdHlwZSA/IHR5cGUgOiBcImRlbGF5ZWRcIik7XG4gICAgICAgIGNsaWVudC5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIC8vY2xpZW50LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgIGNsaWVudC5zZW5kKGRhdGEpO1xuXG4gICAgICAgIGNsaWVudC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0dmFyIHN0YXR1c0NsYXNzID0gcGFyc2VJbnQoY2xpZW50LnN0YXR1cyAvIDEwMCk7XG4gICAgICAgICAgaWYoc3RhdHVzQ2xhc3MgPT0gMiB8fCBzdGF0dXNDbGFzcyA9PSAzIHx8IHN0YXR1c0NsYXNzID09IDAgLyogbG9jYWwgZmlsZXMgKi8pe1xuICAgICAgICAgICAgLy8gUGVyZm9ybXMgdGhlIGZ1bmN0aW9uIFwicmVzb2x2ZVwiIHdoZW4gdGhpcy5zdGF0dXMgaXMgZXF1YWwgdG8gMnh4XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBQZXJmb3JtcyB0aGUgZnVuY3Rpb24gXCJyZWplY3RcIiB3aGVuIHRoaXMuc3RhdHVzIGlzIGRpZmZlcmVudCB0aGFuIDJ4eFxuXG4gICAgICAgICAgICByZWplY3QodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNsaWVudC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcdHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICBjbGllbnQub250aW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHRyZWplY3QodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZXR1cm4gdGhlIHByb21pc2VcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgfTtcblxuXG4gIHJldHVybiB7XG4gIFx0J2dldCcgOiBmdW5jdGlvbihhcmdzKSB7XG4gIFx0XHRyZXR1cm4gY29yZS5yZXEoJ0dFVCcsIHVybCwgYXJncyk7XG4gIFx0fSxcbiAgXHQncG9zdCcgOiBmdW5jdGlvbihhcmdzLCB0eXBlKSB7XG4gIFx0XHRyZXR1cm4gY29yZS5yZXEoJ1BPU1QnLCB1cmwsIGFyZ3MsIHR5cGUpO1xuICBcdH1cbiAgfTtcbn1cbiJdfQ==