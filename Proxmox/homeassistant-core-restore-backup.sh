#!/bin/bash

# Prompt the user for the backup file name
echo -e "****************************************************"
echo -e "Please enter the name of the backup file (without extension):"
read backup_file_name

# Construct the full backup file path
backup_file_path="/srv/homeassistant/backups/${backup_file_name}.tar"

# Check if the backup file exists
if [[ ! -f "$backup_file_path" ]]; then
  echo -e "Error: Backup file not found at ${backup_file_path}. Exiting."
  exit 1
fi

echo -e "**************************************************** \n \t\tHomeAssistant Stopping\n****************************************************"
sudo systemctl stop homeassistant

echo -e "**************************************************** \n \t\tRestoring Backup\n****************************************************"

# Create a temporary directory for restoring
mkdir -p /srv/homeassistant/backups/test

# Extract the main backup archive
tar -xf "$backup_file_path" -C /srv/homeassistant/backups/test

# If the backup includes a compressed homeassistant.tar.gz file, extract it
if [[ -f /srv/homeassistant/backups/test/homeassistant.tar.gz ]]; then
  tar -xvzf /srv/homeassistant/backups/test/homeassistant.tar.gz -C /srv/homeassistant/backups/test
fi

# Copy the data folder from the backup to the Home Assistant directory
sudo cp -r /srv/homeassistant/backups/test/data/* /srv/homeassistant/

# Change ownership and permissions
sudo chown -R homeassistant:homeassistant /srv/homeassistant/
sudo chmod -R 755 /srv/homeassistant/

# Clean up temporary backup directory
rm -r /srv/homeassistant/backups/test

echo -e "**************************************************** \n \t\tHomeAssistant Restarting\n****************************************************"
sudo systemctl start homeassistant

echo -e "**************************************************** \n \t\tHomeAssistant Restarted\n****************************************************"
