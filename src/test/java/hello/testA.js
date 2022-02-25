
          Homestead.backup_postgres(database, "#{dir_prefix}/postgres_backup", config)
        end
        # Backup MongoDB
        if enabled_databases.include? 'mongodb'
          Homestead.backup_mongodb(database, "#{dir_prefix}/mongodb_backup", config)
        end
      end
    end

    # Turn off CFQ scheduler idling https://github.com/laravel/homestead/issues/896
    if settings.has_key?('disable_cfq')
      config.vm.provision 'shell' do |s|
        s.inline = 'sudo sh -c "echo 0 >> /sys/block/sda/queue/iosched/slice_idle"'
      end
      config.vm.provision 'shell' do |s|
        s.inline = 'sudo sh -c "echo 0 >> /sys/block/sda/queue/iosched/group_idle"'
      end
    end
  end

  def self.backup_mysql(database, dir, config)
    now = Time.now.strftime("%Y%m%d%H%M")
    config.trigger.before :destroy do |trigger|
      trigger.warn = "Backing up mysql database #{database}..."
      trigger.run_remote = {inline: "mkdir -p #{dir}/#{now} && mysqldump --routines #{database} > #{dir}/#{now}/#{database}-#{now}.sql"}
    end
  end

  def self.backup_postgres(database, dir, config)
    now = Time.now.strftime("%Y%m%d%H%M")
    config.trigger.before :destroy do |trigger|
      trigger.warn = "Backing up postgres database #{database}..."
      trigger.run_remote = {inline: "mkdir -p #{dir}/#{now} && echo localhost:5432:#{database}:homestead:secret > ~/.pgpass && chmod 600 ~/.pgpass && pg_dump -U homestead -h localhost #{database} > #{dir}/#{now}/#{database}-#{now}.sql"}
    end
  end

  def self.backup_mongodb(database, dir, config)
    now = Time.now.strftime("%Y%m%d%H%M")
    config.trigger.before :destroy do |trigger|
      trigger.warn = "Backing up mongodb database #{database}..."
      trigger.run_remote = {inline: "mkdir -p #{dir}/#{now} && mongodump --db #{database} --out #{dir}/#{now}"}
    end
  end
end

