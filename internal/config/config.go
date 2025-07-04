package config

// Config holds the server configuration
type Config struct {
	Port       int
	Interface  string
	ServerIP   string
	BaseDir    string
	UploadDir  string
	TemplateDir string
	StaticDir   string
}

// New creates a new Config with default values
func New(port int, iface string) *Config {
	return &Config{
		Port:      port,
		Interface: iface,
	}
}
