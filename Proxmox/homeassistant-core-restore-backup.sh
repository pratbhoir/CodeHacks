#!/bin/bash

# Prompt the user for the backup file name
echo -e "****************************************************"
echo -e "Please enter the name of the backup file (without extension):"
read backup_file_name

# Construct the full backup file path
backup_file_path="/homeassistant/backups/${backup_file_name}.tar"

# Check if the backup file exists
if [[ ! -f "$backup_file_path" ]]; then
  echo -e "Error: Backup file not found at ${backup_file_path}. Exiting."
  exit 1
fi

echo -e "**************************************************** \n \t\tHomeAssistant Stopping\n****************************************************"
sudo systemctl stop homeassistant

echo -e "**************************************************** \n \t\tRestoring Backup\n****************************************************"

# Create a temporary directory for restoring
mkdir -p /homeassistant/backups/test

# Extract the main backup archive
tar -xf "$backup_file_path" -C /homeassistant/backups/test

# If the backup includes a compressed homeassistant.tar.gz file, extract it
if [[ -f /homeassistant/backups/test/homeassistant.tar.gz ]]; then
  tar -xvzf /homeassistant/backups/test/homeassistant.tar.gz -C /homeassistant/backups/test
fi

# Copy the data folder from the backup to the Home Assistant directory
sudo cp -r /homeassistant/backups/test/data/* /homeassistant/

# Change ownership and permissions
sudo chown -R homeassistant:homeassistant /homeassistant/
sudo chmod -R 755 /homeassistant/

# Clean up temporary backup directory
rm -r /homeassistant/backups/test

echo -e "**************************************************** \n \t\tHomeAssistant Restarting\n****************************************************"
sudo systemctl start homeassistant

echo -e "**************************************************** \n \t\tHomeAssistant Restarted\n****************************************************"
